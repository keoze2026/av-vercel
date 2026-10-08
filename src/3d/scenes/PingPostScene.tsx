import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { engineScenarios, type BuyerOutcome } from '@/data/engine'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import {
  Chip,
  Glow,
  Packets,
  PulseRing,
  Trace,
  arc,
  makeCurve,
  ramp,
  useStageTime,
  type PacketState,
  type TraceMaterial,
} from '../primitives'

/*
 * Buyer Marketplace & Bidding
 * Each round a call asks every buyer for a bid. Pillars rise to the bid; buyers
 * at their cap or outside the call's geography don't bid, and the highest
 * eligible bid wins the call. Rounds replay the hero's sample auctions.
 */

const CALL: Vec3 = [-3.2, 0, 0]
const HUB: Vec3 = [-1.45, 0, 0]
const PILLARS: Vec3[] = [
  [0.75, 0, -1.6],
  [1.75, 0, -0.55],
  [1.75, 0, 0.55],
  [0.75, 0, 1.6],
]
const PERIOD = 5
/** Pillar height per dollar of bid. */
const PER_DOLLAR = 2.0 / 70

const topColor: Record<BuyerOutcome, string> = {
  won: palette.ok,
  cap: palette.crit,
  outbid: palette.fg3,
  geo: palette.warn,
}

export function PingPostScene() {
  const time = useStageTime()
  const pillars = useRef<(THREE.Mesh | null)[]>([])
  const caps = useRef<(THREE.Mesh | null)[]>([])
  const bidTraces = useRef<(TraceMaterial | null)[]>([])
  const winGlows = useRef<(THREE.Sprite | null)[]>([])
  const hubRing = useRef<THREE.Mesh>(null)

  const callToHub = useMemo(
    () =>
      makeCurve([
        [CALL[0] + 0.45, 0.12, 0],
        [(CALL[0] + HUB[0]) / 2, 0.3, 0],
        [HUB[0] - 0.4, 0.12, 0],
      ]),
    [],
  )
  const hubToPillar = useMemo(
    () => PILLARS.map((p) => arc([HUB[0] + 0.4, 0.12, HUB[2]], [p[0] - 0.36, 0.1, p[2]], 0.3)),
    [],
  )

  useFrame((state) => {
    const t = time(state)
    const round = Math.floor(t / PERIOD)
    const p = t % PERIOD
    const buyers = engineScenarios[round % engineScenarios.length].buyers
    const fall = 1 - ramp(p, 4.4, 4.95)
    const decided = p > 2.0 && p < 4.6
    const winner = buyers.findIndex((b) => b.outcome === 'won')

    buyers.forEach((buyer, i) => {
      const bids = buyer.outcome === 'won' || buyer.outcome === 'outbid'
      const target = bids ? buyer.bid * PER_DOLLAR : 0.14
      const h = Math.max(0.02, target * ramp(p, 0.9 + i * 0.12, 1.7 + i * 0.12) * fall)
      const pillar = pillars.current[i]
      if (pillar) {
        pillar.scale.y = h
        pillar.position.y = 0.06 + h / 2
      }
      const cap = caps.current[i]
      if (cap) {
        cap.position.y = 0.06 + h + 0.03
        const material = cap.material as THREE.MeshBasicMaterial
        material.color.set(decided || !bids ? topColor[buyer.outcome] : palette.brandSoft)
      }
      const trace = bidTraces.current[i]
      if (trace) {
        const asking = p > 0.6 && p < 1.4
        const winning = decided && i === winner
        trace.color.set(winning ? palette.ok : asking ? palette.brand : palette.lineStrong)
        trace.opacity = winning ? 0.95 : asking ? 0.7 : 0.3
      }
      const glow = winGlows.current[i]
      if (glow) (glow.material as THREE.SpriteMaterial).opacity = decided && i === winner ? 0.65 * fall : 0
      if (glow) glow.position.y = 0.06 + h + 0.2
    })

    if (hubRing.current) hubRing.current.rotation.z = t * 0.8

  })

  // The call: to the auction, then to the winner once bids are in.
  const update = (_: number, t: number, out: PacketState) => {
    const p = t % PERIOD
    const buyers = engineScenarios[Math.floor(t / PERIOD) % engineScenarios.length].buyers
    const winner = buyers.findIndex((b) => b.outcome === 'won')
    if (p < 0.65) {
      callToHub.getPointAt(ramp(p, 0, 0.6), out.position)
      out.color.set(palette.brandSoft)
      if (p > 0.6) out.scale = 0
    } else {
      hubToPillar[winner].getPointAt(ramp(p, 2.0, 2.6), out.position)
      out.color.set(palette.ok)
      if (p < 2.0 || p > 2.65) out.scale = 0
    }
  }

  return (
    <group>
      <Chip position={CALL} size={[0.8, 0.12, 0.7]} edge={palette.brand}>
        <Glow position={[0, 0.3, 0]} scale={1.1} opacity={0.45} />
      </Chip>
      <Trace curve={callToHub} color={palette.brandDeep} opacity={0.8} width={1.6} />

      {/* Auction hub */}
      <group position={HUB}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 48]} />
          <meshStandardMaterial color={palette.raised} roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh ref={hubRing} position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.26, 0.31, 48, 1, 0, Math.PI * 1.5]} />
          <meshBasicMaterial color={palette.brand} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <PulseRing position={[HUB[0], 0.13, HUB[2]]} period={PERIOD} phase={-0.6} size={0.7} />

      {PILLARS.map((pos, i) => (
        <group key={i}>
          <Trace curve={hubToPillar[i]} ref={(m) => void (bidTraces.current[i] = m)} opacity={0.3} />
          <Chip position={pos} size={[0.62, 0.06, 0.62]} />
          <mesh ref={(m) => void (pillars.current[i] = m)} position={[pos[0], 0.1, pos[2]]}>
            <boxGeometry args={[0.36, 1, 0.36]} />
            <meshStandardMaterial
              color={palette.brandDeep}
              emissive={palette.brand}
              emissiveIntensity={0.3}
              transparent
              opacity={0.85}
              roughness={0.45}
            />
          </mesh>
          <mesh ref={(m) => void (caps.current[i] = m)} position={[pos[0], 0.2, pos[2]]}>
            <boxGeometry args={[0.38, 0.05, 0.38]} />
            <meshBasicMaterial color={palette.brandSoft} toneMapped={false} />
          </mesh>
          <Glow ref={(g) => void (winGlows.current[i] = g)} position={[pos[0], 1, pos[2]]} color={palette.ok} scale={1.4} opacity={0} />
        </group>
      ))}

      <Packets count={1} update={update} glow={0.6} />
    </group>
  )
}
