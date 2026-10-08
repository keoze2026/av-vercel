import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import { Chip, GateFrame, Packets, PulseRing, hash, useStageTime, type PacketState } from '../primitives'

/*
 * Compliance & Call Screening
 * Every attempt runs through DNC, TCPA consent and VoIP / velocity checks before
 * a buyer is rung. A failed check stops the call at that gate and it drops out;
 * calls that pass reach the buyer. Each decision is stacked onto the log.
 */

const START_X = -3.6
const END_X = 3.0
const GATES_X = [-1.75, -0.15, 1.45]
const BUYER: Vec3 = [3.45, 0, 0]
const LOG: Vec3 = [2.4, 0, -1.5]
const Y = 0.42

const SLOTS = 7
const PERIOD = 6.3
/** Seconds a blocked call takes to drop out. */
const DROP = 0.7
const LOG_EVERY = PERIOD / SLOTS
const LOG_PLATES = 8

/** Which gate stops this call, or -1 when it passes. */
function blockedAt(slot: number, cycle: number) {
  const r = hash(slot * 31 + cycle * 17)
  if (r < 0.62) return -1
  return r < 0.77 ? 0 : r < 0.89 ? 1 : 2
}

function slotPhase(slot: number, t: number) {
  const shifted = t + (slot * PERIOD) / SLOTS
  return { cycle: Math.floor(shifted / PERIOD), p: (shifted % PERIOD) / PERIOD }
}

/** Progress (0–1) at which a call reaches x. */
const progressAt = (x: number) => (x - START_X) / (END_X - START_X) * 0.82

const brand = new THREE.Color(palette.brand)
const ok = new THREE.Color(palette.ok)
const crit = new THREE.Color(palette.crit)
const rest = new THREE.Color(palette.brandSoft)

export function FraudScene() {
  const time = useStageTime()
  const gates = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const plates = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = time(state)
    const heat = GATES_X.map(() => ({ pass: 0, block: 0 }))
    for (let s = 0; s < SLOTS; s += 1) {
      const { cycle, p } = slotPhase(s, t)
      const stop = blockedAt(s, cycle)
      GATES_X.forEach((x, g) => {
        if (stop !== -1 && g > stop) return
        const near = 1 - Math.min(1, Math.abs(p - progressAt(x)) / 0.035)
        if (g === stop) heat[g].block = Math.max(heat[g].block, near)
        else heat[g].pass = Math.max(heat[g].pass, near)
      })
    }
    gates.current.forEach((m, g) => {
      if (!m) return
      const { pass, block } = heat[g]
      m.color.copy(rest).lerp(block > pass ? crit : brand, Math.max(pass, block))
    })

    // Decision log: one plate per decision, reset when the stack is full.
    const decisions = Math.floor(t / LOG_EVERY)
    const shown = (decisions % LOG_PLATES) + 1
    plates.current.forEach((plate, i) => {
      if (!plate) return
      plate.visible = i < shown
      const n = decisions - (shown - 1 - i)
      const material = plate.material as THREE.MeshBasicMaterial
      material.color.set(hash(n * 3.7) < 0.7 ? palette.ok : palette.crit)
    })
  })

  const update = (slot: number, t: number, out: PacketState) => {
    const { cycle, p } = slotPhase(slot, t)
    const stop = blockedAt(slot, cycle)
    const stopP = stop === -1 ? Infinity : progressAt(GATES_X[stop])
    if (p < stopP) {
      const travel = Math.min(1, p / 0.82)
      const x = START_X + travel * (END_X - START_X)
      out.position.set(x, Y, 0)
      const cleared = x > GATES_X[GATES_X.length - 1] + 0.1
      out.color.copy(cleared ? ok : brand)
      if (p > 0.82) {
        out.position.set(END_X, Y, 0)
        out.scale = 0
      }
      return
    }
    // Blocked: turn red at the gate, then drop out of the path.
    const since = ((p - stopP) * PERIOD) / DROP
    if (since > 1) {
      out.scale = 0
      return
    }
    out.position.set(GATES_X[stop] - 0.12, Y - since * 0.45, since * 0.7)
    out.color.copy(crit)
    out.scale = 1 - since * 0.6
  }

  return (
    <group>
      {/* The path every attempt takes */}
      <mesh position={[(START_X + END_X) / 2, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[END_X - START_X, 0.36]} />
        <meshBasicMaterial color={palette.line} toneMapped={false} />
      </mesh>
      <mesh position={[(START_X + END_X) / 2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[END_X - START_X, 0.02]} />
        <meshBasicMaterial color={palette.brandDeep} toneMapped={false} />
      </mesh>

      {GATES_X.map((x, g) => (
        <GateFrame key={g} ref={(m) => void (gates.current[g] = m)} position={[x, 0, 0]} width={1.0} height={0.95} />
      ))}

      <Chip position={[START_X - 0.5, 0, 0]} size={[0.7, 0.1, 0.7]} edge={palette.brand} />
      <Chip position={BUYER} size={[0.8, 0.12, 0.8]} edge={palette.ok}>
        <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={palette.ok} toneMapped={false} />
        </mesh>
      </Chip>
      <PulseRing position={[BUYER[0], 0.13, 0]} color={palette.ok} period={PERIOD / SLOTS} size={0.55} />

      {/* Where blocked attempts end up */}
      <mesh position={[-0.15, 0.004, 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 0.5]} />
        <meshBasicMaterial color={palette.crit} transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* Decision log */}
      <Chip position={LOG} size={[0.8, 0.05, 0.55]} />
      {Array.from({ length: LOG_PLATES }, (_, i) => (
        <mesh key={i} ref={(m) => void (plates.current[i] = m)} position={[LOG[0], 0.09 + i * 0.07, LOG[2]]}>
          <boxGeometry args={[0.6, 0.035, 0.38]} />
          <meshBasicMaterial color={palette.ok} toneMapped={false} />
        </mesh>
      ))}

      <Packets count={SLOTS} update={update} />
    </group>
  )
}
