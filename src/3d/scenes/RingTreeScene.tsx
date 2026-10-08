import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import {
  Chip,
  Glow,
  Packets,
  Trace,
  arc,
  ramp,
  useStageTime,
  type PacketState,
  type TraceMaterial,
} from '../primitives'

/*
 * First-Ring Intent Scoring
 * While the call rings, four signals (geo, time of day, line type, history)
 * build an intent score. The score is checked against the tier thresholds and
 * the call connects to the best eligible tier before the first ring ends.
 */

const CALLER: Vec3 = [-3.0, 0, 0]
const SIGNAL_X = [-1.75, -1.3, -0.85, -0.4]
const COLUMN: Vec3 = [0.65, 0, 0]
const COLUMN_HEIGHT = 2.0
/** Tier thresholds as score values, and where each tier's buyer sits. */
const TIERS = [
  { min: 70, pos: [2.75, 1.45, -0.55] as Vec3 },
  { min: 50, pos: [2.75, 0.95, 0.35] as Vec3 },
  { min: 0, pos: [2.75, 0.3, 1.1] as Vec3 },
]
const SCORES = [86, 63, 92, 44]
/** Share of the score each signal contributes. */
const WEIGHTS = [0.32, 0.18, 0.24, 0.26]
const PERIOD = 6

const tierFor = (score: number) => TIERS.findIndex((tier) => score >= tier.min)

export function RingTreeScene() {
  const time = useStageTime()
  const bars = useRef<(THREE.Mesh | null)[]>([])
  const fill = useRef<THREE.Mesh>(null)
  const fillMat = useRef<THREE.MeshBasicMaterial>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const beamMats = useRef<(TraceMaterial | null)[]>([])
  const buyerMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const buyerGlows = useRef<(THREE.Sprite | null)[]>([])

  const beams = useMemo(
    () => TIERS.map((tier) => arc([COLUMN[0] + 0.3, COLUMN_HEIGHT * 0.86, 0], [tier.pos[0] - 0.5, tier.pos[1] + 0.06, tier.pos[2]], 0.25)),
    [],
  )

  useFrame((state) => {
    const t = time(state)
    const loop = Math.floor(t / PERIOD)
    const p = t % PERIOD
    const score = SCORES[loop % SCORES.length]
    const tier = tierFor(score)
    const fade = 1 - ramp(p, 5.3, 5.9)

    // Ringing: pulses until the call connects.
    rings.current.forEach((ring, i) => {
      if (!ring) return
      const phase = ((p + i * 0.55) % 1.1) / 1.1
      const ringing = p < 2.6 ? 1 : 0
      ring.scale.setScalar(0.6 + phase * 1.3)
      const material = ring.material as THREE.MeshBasicMaterial
      material.opacity = (1 - phase) * 0.7 * ringing
    })

    // Signals grow one after another, then the column fills to the score.
    bars.current.forEach((bar, i) => {
      if (!bar) return
      const h = (score / 100) * WEIGHTS[i] * 4.2 * ramp(p, 0.3 + i * 0.25, 0.8 + i * 0.25) * fade
      bar.scale.y = Math.max(0.001, h)
      bar.position.y = h / 2
    })
    const level = (score / 100) * COLUMN_HEIGHT * ramp(p, 1.3, 2.2) * fade
    if (fill.current) {
      fill.current.scale.y = Math.max(0.001, level)
      fill.current.position.y = level / 2
    }
    const cleared = p > 2.2 && p < 5.4
    fillMat.current?.color.set(cleared && tier === 0 ? palette.brand : palette.brandDeep)

    // Connect to the tier the score qualifies for.
    beamMats.current.forEach((m, i) => {
      if (!m) return
      const on = i === tier && p > 2.3 && p < 5.4
      m.color.set(on ? (i === TIERS.length - 1 ? palette.warn : palette.brand) : palette.lineStrong)
      m.opacity = on ? 0.95 : 0.3
    })
    const connected = p > 3.0 && p < 5.4
    buyerMats.current.forEach((m, i) => m?.color.set(connected && i === tier ? palette.ok : palette.fg4))
    buyerGlows.current.forEach((g, i) => {
      if (g) (g.material as THREE.SpriteMaterial).opacity = connected && i === tier ? 0.7 * fade : 0
    })
  })

  // The call travels from the column to the tier it qualified for.
  const update = (_: number, t: number, out: PacketState) => {
    const p = t % PERIOD
    const tier = tierFor(SCORES[Math.floor(t / PERIOD) % SCORES.length])
    beams[tier].getPointAt(ramp(p, 2.3, 3.0), out.position)
    out.color.set(tier === TIERS.length - 1 ? palette.warn : palette.brandSoft)
    if (p < 2.3 || p > 3.05) out.scale = 0
  }

  return (
    <group>
      {/* Caller, ringing */}
      <Chip position={CALLER} size={[0.8, 0.1, 0.8]} edge={palette.brand}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshBasicMaterial color={palette.brandSoft} toneMapped={false} />
        </mesh>
        <Glow position={[0, 0.5, 0]} scale={1.2} opacity={0.5} />
        {[0, 1].map((i) => (
          <mesh key={i} ref={(r) => void (rings.current[i] = r)} position={[0, 0.5, 0]}>
            <torusGeometry args={[0.32, 0.012, 8, 64]} />
            <meshBasicMaterial color={palette.brand} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        ))}
      </Chip>

      {/* Four signals */}
      {SIGNAL_X.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.34, 0.34]} />
            <meshBasicMaterial color={palette.line} toneMapped={false} />
          </mesh>
          <mesh ref={(r) => void (bars.current[i] = r)}>
            <boxGeometry args={[0.26, 1, 0.26]} />
            <meshStandardMaterial
              color={palette.brandDeep}
              emissive={palette.brand}
              emissiveIntensity={0.35 + i * 0.1}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Intent column with threshold planes */}
      <group position={COLUMN}>
        <mesh position={[0, COLUMN_HEIGHT / 2, 0]}>
          <boxGeometry args={[0.5, COLUMN_HEIGHT, 0.5]} />
          <meshBasicMaterial color={palette.brand} transparent opacity={0.05} depthWrite={false} />
        </mesh>
        <lineSegments position={[0, COLUMN_HEIGHT / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.5, COLUMN_HEIGHT, 0.5)]} />
          <lineBasicMaterial color={palette.lineStrong} />
        </lineSegments>
        <mesh ref={fill}>
          <boxGeometry args={[0.42, 1, 0.42]} />
          <meshBasicMaterial ref={fillMat} color={palette.brandDeep} toneMapped={false} />
        </mesh>
        {[
          { at: 0.7, color: palette.brandSoft, opacity: 0.18 },
          { at: 0.5, color: palette.fg3, opacity: 0.08 },
        ].map((plane) => (
          <group key={plane.at} position={[0, plane.at * COLUMN_HEIGHT, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.1, 1.1]} />
              <meshBasicMaterial color={plane.color} transparent opacity={plane.opacity} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
            <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 1.1)]} />
              <lineBasicMaterial color={plane.color} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* Tiers */}
      {TIERS.map((tier, i) => (
        <group key={i}>
          <mesh position={[tier.pos[0], tier.pos[1] / 2, tier.pos[2]]}>
            <cylinderGeometry args={[0.012, 0.012, tier.pos[1], 6]} />
            <meshBasicMaterial color={palette.lineStrong} />
          </mesh>
          <Chip position={tier.pos} size={[0.85, 0.08, 0.5]} edge={i === TIERS.length - 1 ? palette.warn : palette.lineStrong}>
            <mesh position={[-0.3, 0.095, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial ref={(m) => void (buyerMats.current[i] = m)} color={palette.fg4} toneMapped={false} />
            </mesh>
          </Chip>
          <Glow ref={(g) => void (buyerGlows.current[i] = g)} position={[tier.pos[0], tier.pos[1] + 0.2, tier.pos[2]]} color={palette.ok} scale={1.3} opacity={0} />
          <Trace curve={beams[i]} ref={(m) => void (beamMats.current[i] = m)} opacity={0.3} width={1.5} />
        </group>
      ))}

      <Packets count={1} update={update} glow={0.6} />
    </group>
  )
}
