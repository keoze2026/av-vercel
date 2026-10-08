import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import { Chip, Glow, Packets, PulseRing, Trace, arc, useStageTime, type PacketState, type TraceMaterial } from '../primitives'

/*
 * Numbers & Call Tracking
 * Eight pooled tracking numbers feed two campaigns; each call lights the number it
 * rang on, travels to that number's campaign, then on to the buyer.
 */

const CHIPS: Vec3[] = [-3.2, -2.1].flatMap((x) => [-1.35, -0.45, 0.45, 1.35].map((z): Vec3 => [x, 0, z]))
const HUBS: Vec3[] = [
  [0.3, 0, -0.85],
  [0.3, 0, 0.85],
]
const BUYER: Vec3 = [2.9, 0, 0]

const SLOTS = 4
const PERIOD = 3.2
/** Fraction of a loop spent number → campaign, then campaign → buyer. */
const LEG1 = 0.45
const LEG2 = 0.8

function route(slot: number, cycle: number) {
  return { chip: (cycle * 5 + slot * 3) % CHIPS.length, hub: (cycle + slot) % HUBS.length }
}

function slotPhase(slot: number, t: number) {
  const shifted = t + (slot * PERIOD) / SLOTS
  return { cycle: Math.floor(shifted / PERIOD), p: (shifted % PERIOD) / PERIOD }
}

const brand = new THREE.Color(palette.brand)
const ok = new THREE.Color(palette.ok)
const dim = new THREE.Color(palette.lineStrong)
const led = new THREE.Color(palette.fg4)

export function TrackingScene() {
  const time = useStageTime()
  const toHub = useMemo(
    () =>
      CHIPS.map((c) =>
        HUBS.map((h) => arc([c[0] + 0.42, 0.08, c[2]], [h[0] - 0.55, 0.14, h[2]], 0.22)),
      ),
    [],
  )
  const toBuyer = useMemo(
    () => HUBS.map((h) => arc([h[0] + 0.55, 0.14, h[2]], [BUYER[0] - 0.6, 0.12, BUYER[2]], 0.3)),
    [],
  )

  const traceMats = useRef<(TraceMaterial | null)[]>([])
  const ledMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const hubGlows = useRef<(THREE.Sprite | null)[]>([])
  const hubRings = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = time(state)
    const litTrace = new Set<number>()
    const ringing = new Set<number>()
    const hubHeat = [0, 0]
    for (let s = 0; s < SLOTS; s += 1) {
      const { cycle, p } = slotPhase(s, t)
      const { chip, hub } = route(s, cycle)
      if (p < LEG1) litTrace.add(chip * HUBS.length + hub)
      if (p < 0.14) ringing.add(chip)
      hubHeat[hub] = Math.max(hubHeat[hub], 1 - Math.min(1, Math.abs(p - LEG1) / 0.08))
    }
    traceMats.current.forEach((m, i) => {
      if (!m) return
      const on = litTrace.has(i)
      m.color.copy(on ? brand : dim)
      m.opacity = on ? 0.95 : 0.35
    })
    ledMats.current.forEach((m, i) => m?.color.copy(ringing.has(i) ? brand : led))
    hubGlows.current.forEach((g, i) => {
      if (g) (g.material as THREE.SpriteMaterial).opacity = 0.25 + hubHeat[i] * 0.6
    })
    hubRings.current.forEach((r, i) => {
      if (r) r.rotation.z = t * 0.6 * (i ? -1 : 1)
    })
  })

  const update = (slot: number, t: number, out: PacketState) => {
    const { cycle, p } = slotPhase(slot, t)
    const { chip, hub } = route(slot, cycle)
    if (p < LEG1) {
      toHub[chip][hub].getPointAt(p / LEG1, out.position)
      out.color.copy(brand)
    } else if (p < LEG2) {
      const u = (p - LEG1) / (LEG2 - LEG1)
      toBuyer[hub].getPointAt(u, out.position)
      out.color.copy(brand).lerp(ok, Math.max(0, (u - 0.6) / 0.4))
    } else {
      out.position.set(...BUYER)
      out.scale = 0
    }
  }

  return (
    <group>
      {CHIPS.map((c, i) => (
        <Chip key={i} position={c} size={[0.84, 0.07, 0.36]}>
          <mesh position={[-0.3, 0.085, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial ref={(m) => void (ledMats.current[i] = m)} color={palette.fg4} toneMapped={false} />
          </mesh>
          {[0, 1, 2, 3, 4].map((d) => (
            <mesh key={d} position={[-0.14 + d * 0.1, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.06, 0.12]} />
              <meshBasicMaterial color={palette.lineStrong} toneMapped={false} />
            </mesh>
          ))}
        </Chip>
      ))}

      {toHub.flatMap((row, c) =>
        row.map((curve, h) => (
          <Trace
            key={`${c}-${h}`}
            curve={curve}
            ref={(m) => void (traceMats.current[c * HUBS.length + h] = m)}
            opacity={0.35}
          />
        )),
      )}
      {toBuyer.map((curve, i) => (
        <Trace key={i} curve={curve} color={palette.brandDeep} opacity={0.7} width={1.6} />
      ))}

      {HUBS.map((h, i) => (
        <group key={i} position={h}>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.22, 6]} />
            <meshStandardMaterial color={palette.raised} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh ref={(r) => void (hubRings.current[i] = r)} position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.36, 6]} />
            <meshBasicMaterial color={palette.brand} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <Glow ref={(g) => void (hubGlows.current[i] = g)} position={[0, 0.35, 0]} scale={1.6} opacity={0.3} />
        </group>
      ))}

      <Chip position={BUYER} size={[1.1, 0.12, 0.8]} edge={palette.ok}>
        <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial color={palette.ok} toneMapped={false} />
        </mesh>
      </Chip>
      <PulseRing position={[BUYER[0], 0.13, BUYER[2]]} color={palette.ok} period={PERIOD / SLOTS} phase={-((LEG2 * PERIOD) % (PERIOD / SLOTS))} size={0.6} />

      <Packets count={SLOTS} update={update} />
    </group>
  )
}
