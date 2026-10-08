import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import {
  Chip,
  GateFrame,
  Packets,
  Trace,
  arc,
  hash,
  makeCurve,
  useStageTime,
  type PacketState,
} from '../primitives'

/*
 * Visual Campaign Routing
 * Calls pass an intent gate, split on state / daypart rules, and land on an
 * eligible buyer. Calls below the intent threshold divert to a fallback.
 */

const ROOT: Vec3 = [-3.5, 0, 0]
const GATE_A: Vec3 = [-1.85, 0, 0]
const GATE_B: Vec3[] = [
  [0.15, 0, -1.0],
  [0.15, 0, 1.0],
]
const BUYERS: Vec3[] = [
  [2.4, 0, -1.6],
  [2.4, 0, -0.5],
  [2.4, 0, 0.5],
  [2.4, 0, 1.6],
]
const FALLBACK: Vec3 = [-0.6, 0, 2.3]

const SLOTS = 8
const PERIOD = 4.2
/** Progress points (fraction of a loop) where a call reaches each stage. */
const AT_A = 0.28
const AT_B = 0.55
const AT_BUYER = 0.8

const H = 0.45 // travel height through the gates

interface Route {
  reject: boolean
  branch: number
  buyer: number
}

function route(slot: number, cycle: number): Route {
  const r = hash(slot * 13 + cycle * 7)
  const branch = (slot + cycle) % 2
  return { reject: r < 0.22, branch, buyer: branch * 2 + (r > 0.6 ? 1 : 0) }
}

function slotPhase(slot: number, t: number) {
  const shifted = t + (slot * PERIOD) / SLOTS
  return { cycle: Math.floor(shifted / PERIOD), p: (shifted % PERIOD) / PERIOD }
}

const brand = new THREE.Color(palette.brand)
const ok = new THREE.Color(palette.ok)
const warn = new THREE.Color(palette.warn)
const rest = new THREE.Color(palette.brandSoft)

export function IvrScene() {
  const time = useStageTime()
  const curves = useMemo(() => {
    const rootToA = makeCurve([
      [ROOT[0] + 0.5, 0.1, 0],
      [GATE_A[0] - 0.6, H, 0],
      [GATE_A[0], H, 0],
    ])
    const aToB = GATE_B.map((b) =>
      makeCurve([
        [GATE_A[0], H, 0],
        [GATE_A[0] + 0.8, H, b[2] * 0.5],
        [b[0], H, b[2]],
      ]),
    )
    const bToBuyer = BUYERS.map((buyer, i) => {
      const b = GATE_B[i < 2 ? 0 : 1]
      return makeCurve([
        [b[0], H, b[2]],
        [b[0] + 1.0, H * 0.8, (b[2] + buyer[2]) / 2],
        [buyer[0] - 0.5, 0.12, buyer[2]],
      ])
    })
    const aToFallback = arc([GATE_A[0], H, 0], [FALLBACK[0], 0.12, FALLBACK[2] - 0.3], 0.1)
    return { rootToA, aToB, bToBuyer, aToFallback }
  }, [])

  const gateA = useRef<THREE.MeshBasicMaterial>(null)
  const gateB = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const buyerLeds = useRef<(THREE.MeshBasicMaterial | null)[]>([])

  useFrame((state) => {
    const t = time(state)
    let flashA = 0
    let rejectA = 0
    const flashB = [0, 0]
    const landed = [0, 0, 0, 0]
    for (let s = 0; s < SLOTS; s += 1) {
      const { cycle, p } = slotPhase(s, t)
      const r = route(s, cycle)
      const nearA = 1 - Math.min(1, Math.abs(p - AT_A) / 0.05)
      if (r.reject) rejectA = Math.max(rejectA, nearA)
      else flashA = Math.max(flashA, nearA)
      if (!r.reject) {
        flashB[r.branch] = Math.max(flashB[r.branch], 1 - Math.min(1, Math.abs(p - AT_B) / 0.05))
        if (p > AT_BUYER - 0.02 && p < AT_BUYER + 0.12) landed[r.buyer] = 1
      }
    }
    gateA.current?.color.copy(rest).lerp(rejectA > flashA ? warn : brand, Math.max(flashA, rejectA))
    gateB.current.forEach((m, i) => m?.color.copy(rest).lerp(brand, flashB[i]))
    buyerLeds.current.forEach((m, i) => m?.color.set(landed[i] ? palette.ok : palette.fg4))
  })

  const update = (slot: number, t: number, out: PacketState) => {
    const { cycle, p } = slotPhase(slot, t)
    const r = route(slot, cycle)
    if (p < AT_A) {
      curves.rootToA.getPointAt(p / AT_A, out.position)
      out.color.copy(brand)
      return
    }
    if (r.reject) {
      const u = (p - AT_A) / (AT_BUYER - AT_A)
      if (u > 1) return void (out.scale = 0)
      curves.aToFallback.getPointAt(u, out.position)
      out.color.copy(warn)
      return
    }
    if (p < AT_B) {
      curves.aToB[r.branch].getPointAt((p - AT_A) / (AT_B - AT_A), out.position)
      out.color.copy(brand)
      return
    }
    if (p < AT_BUYER) {
      const u = (p - AT_B) / (AT_BUYER - AT_B)
      curves.bToBuyer[r.buyer].getPointAt(u, out.position)
      out.color.copy(brand).lerp(ok, Math.max(0, (u - 0.6) / 0.4))
      return
    }
    out.position.set(...BUYERS[r.buyer])
    out.scale = 0
  }

  return (
    <group>
      <Chip position={ROOT} size={[0.9, 0.12, 0.7]} edge={palette.brand} />
      <Trace curve={curves.rootToA} color={palette.brandDeep} opacity={0.8} width={1.6} />

      <GateFrame ref={gateA} position={GATE_A} width={1.0} height={0.9} />
      {GATE_B.map((b, i) => (
        <GateFrame key={i} ref={(m) => void (gateB.current[i] = m)} position={b} width={0.9} height={0.9} />
      ))}

      {curves.aToB.map((c, i) => (
        <Trace key={`ab${i}`} curve={c} color={palette.brandDeep} opacity={0.6} />
      ))}
      {curves.bToBuyer.map((c, i) => (
        <Trace key={`bb${i}`} curve={c} opacity={0.5} />
      ))}
      <Trace curve={curves.aToFallback} color={palette.warn} opacity={0.35} />

      {BUYERS.map((b, i) => (
        <Chip key={i} position={b} size={[0.9, 0.08, 0.42]}>
          <mesh position={[-0.32, 0.095, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial ref={(m) => void (buyerLeds.current[i] = m)} color={palette.fg4} toneMapped={false} />
          </mesh>
        </Chip>
      ))}
      <Chip position={FALLBACK} size={[0.9, 0.06, 0.5]} edge={palette.warn} />

      <Packets count={SLOTS} update={update} />
    </group>
  )
}
