import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../palette'
import {
  GateFrame,
  Glow,
  Packets,
  Trace,
  hash,
  makeCurve,
  useStageTime,
  type PacketState,
} from '../primitives'

/*
 * Ambient call field (home hero backdrop)
 * Calls stream out of the distance along converging lanes toward the routing
 * engine at the bottom of the hero. A few lanes pass a screening gate where
 * the odd call is blocked; qualified calls turn green as they arrive.
 */

const LANES = 11
const PER_LANE = 2
const FAR_Z = -30
const NEAR_Z = 0.5
/** Lanes that carry a screening gate, and where along the lane it stands. */
const GATED = [1, 4, 6, 9]
const GATE_AT = 0.4

const laneU = (i: number) => i / (LANES - 1) - 0.5
const periodOf = (lane: number) => 9 + (lane % 3) * 1.7

const soft = new THREE.Color(palette.brandSoft)
const ok = new THREE.Color(palette.ok)
const crit = new THREE.Color(palette.crit)
const brand = new THREE.Color(palette.brand)
const rest = new THREE.Color(palette.lineStrong)

/** Packet `slot` on its lane at scene time t: progress, loop index and fate. */
function packetPhase(slot: number, t: number) {
  const lane = slot % LANES
  const nth = Math.floor(slot / LANES)
  const period = periodOf(lane)
  const shifted = t + nth * period * 0.5 + hash(lane) * period
  const cycle = Math.floor(shifted / period)
  const u = (shifted % period) / period
  const r = hash(lane * 31 + nth * 7 + cycle * 13)
  const blocked = GATED.includes(lane) && r < 0.18
  const qualified = !blocked && r > 0.72
  return { lane, u, blocked, qualified }
}

export function AmbientScene() {
  const time = useStageTime()
  const lanes = useMemo(
    () =>
      Array.from({ length: LANES }, (_, i) => {
        const u = laneU(i)
        const startX = u * 36
        const wobble = Math.sin(i * 1.7) * 1.4
        return makeCurve([
          [startX, 0.03, FAR_Z],
          [startX * 0.55 + wobble, 0.03, -16],
          [startX * 0.22 + wobble * 0.4, 0.03, -6],
          [u * 7, 0.03, NEAR_Z],
        ])
      }),
    [],
  )
  const gates = useMemo(
    () =>
      GATED.map((lane) => {
        const curve = lanes[lane]
        const position = curve.getPointAt(GATE_AT)
        const tangent = curve.getTangentAt(GATE_AT)
        return {
          lane,
          position: [position.x, 0, position.z] as [number, number, number],
          rotation: Math.atan2(-tangent.z, tangent.x),
        }
      }),
    [lanes],
  )
  const gateMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])

  useFrame((state) => {
    const t = time(state)
    const heat = gates.map(() => ({ pass: 0, block: 0 }))
    for (let slot = 0; slot < LANES * PER_LANE; slot += 1) {
      const { lane, u, blocked } = packetPhase(slot, t)
      const g = GATED.indexOf(lane)
      if (g === -1) continue
      const near = 1 - Math.min(1, Math.abs(u - GATE_AT) / 0.04)
      if (blocked) heat[g].block = Math.max(heat[g].block, near)
      else heat[g].pass = Math.max(heat[g].pass, near)
    }
    gateMats.current.forEach((m, g) => {
      if (!m) return
      const { pass, block } = heat[g]
      m.color.copy(rest).lerp(block > pass ? crit : brand, Math.max(pass, block))
    })
  })

  const update = (slot: number, t: number, out: PacketState) => {
    const { lane, u, blocked, qualified } = packetPhase(slot, t)
    lanes[lane].getPointAt(Math.min(u, blocked ? GATE_AT : 1), out.position)
    out.position.y = 0.12
    out.color.copy(soft)
    if (qualified) out.color.lerp(ok, THREE.MathUtils.smoothstep(u, 0.7, 0.9))
    if (blocked && u > GATE_AT - 0.02) {
      const since = (u - GATE_AT) / 0.08
      out.color.copy(crit)
      out.scale = since > 1 ? 0 : 1 - Math.max(0, since)
    }
    // Emerge from the fog, and fade before reaching the viewer so nothing swells in the foreground.
    const fade = THREE.MathUtils.smoothstep(u, 0.01, 0.07) * (1 - THREE.MathUtils.smoothstep(u, 0.7, 0.92))
    out.scale *= fade
  }

  return (
    <group>
      <Glow position={[0, 1.2, FAR_Z + 4]} color={palette.brandDeep} scale={26} opacity={0.22} />
      {lanes.map((curve, i) => (
        <Trace key={i} curve={curve} color={palette.brandDeep} opacity={0.36} width={1} />
      ))}
      {gates.map((gate, g) => (
        <group key={gate.lane} position={gate.position} rotation={[0, gate.rotation, 0]}>
          <GateFrame ref={(m) => void (gateMats.current[g] = m)} position={[0, 0, 0]} width={1.1} height={0.8} />
        </group>
      ))}
      <Packets count={LANES * PER_LANE} update={update} glow={0.8} radius={0.045} trail={9} />
    </group>
  )
}
