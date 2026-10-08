import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../config'
import { palette } from '../palette'
import { Chip, Glow, ramp, useStageTime } from '../primitives'

/*
 * Live Monitoring & Reporting
 * Three in-flight calls run as live waveforms from caller to buyer; a supervisor
 * is listening in on the middle call. Behind them, calls by hour stack up by
 * outcome (converted, not converted, no answer, blocked) as they are recorded.
 */

const LANES = [-0.95, 0, 0.95]
const LANE_START = -2.55
const BAR_STEP = 0.1
const BARS_PER_LANE = 34
const SUPERVISED = 1
const SUPERVISOR: Vec3 = [-0.9, 1.45, 0]

/** Calls by hour per outcome series (sample), oldest first. */
const HOURS = [
  [0.5, 0.18, 0.1, 0.04],
  [0.62, 0.2, 0.12, 0.05],
  [0.7, 0.24, 0.1, 0.05],
  [0.82, 0.22, 0.14, 0.06],
  [0.95, 0.26, 0.12, 0.05],
  [1.02, 0.3, 0.15, 0.07],
  [0.9, 0.27, 0.13, 0.06],
  [1.1, 0.28, 0.16, 0.06],
  [1.2, 0.32, 0.14, 0.07],
  [1.05, 0.3, 0.15, 0.06],
]
const CHART_Z = -2.6
const CHART_X0 = -2.6
const CHART_STEP = 0.42
/** The newest hour fills over this many seconds, then the loop repeats. */
const HOUR_PERIOD = 6

function Waveforms() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const time = useStageTime()
  const object = useMemo(() => new THREE.Object3D(), [])
  const count = LANES.length * BARS_PER_LANE

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const brand = new THREE.Color(palette.brand)
    const soft = new THREE.Color(palette.brandSoft)
    for (let i = 0; i < count; i += 1) {
      m.setColorAt(i, Math.floor(i / BARS_PER_LANE) === SUPERVISED ? soft : brand)
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count])

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const t = time(state)
    for (let lane = 0; lane < LANES.length; lane += 1) {
      for (let b = 0; b < BARS_PER_LANE; b += 1) {
        const x = LANE_START + b * BAR_STEP
        const speech = Math.abs(Math.sin(x * 4.2 - t * 3.4 + lane * 1.7))
        const envelope = 0.55 + 0.45 * Math.sin(x * 1.3 + t * 0.9 + lane * 2.1)
        const h = 0.05 + 0.42 * speech * envelope
        object.position.set(x, h / 2, LANES[lane])
        object.scale.set(1, h, 1)
        object.updateMatrix()
        m.setMatrixAt(lane * BARS_PER_LANE + b, object.matrix)
      }
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.045, 1, 0.12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function HourlyChart() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const time = useStageTime()
  const object = useMemo(() => new THREE.Object3D(), [])
  const count = HOURS.length * 4

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    // Series colours, muted toward the surface: reporting is context here, not the subject.
    const surface = new THREE.Color(palette.surface)
    for (let i = 0; i < count; i += 1) {
      m.setColorAt(i, new THREE.Color(palette.series[i % 4]).lerp(surface, 0.45))
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count])

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const t = time(state)
    const grow = ramp(t % HOUR_PERIOD, 0.2, HOUR_PERIOD - 0.8)
    HOURS.forEach((hour, h) => {
      const newest = h === HOURS.length - 1
      let y = 0
      hour.forEach((value, s) => {
        // 2px gaps between segments, as in the console charts.
        const height = Math.max(0.001, value * (newest ? grow : 1))
        object.position.set(CHART_X0 + h * CHART_STEP, y + height / 2, CHART_Z)
        object.scale.set(1, height, 1)
        object.updateMatrix()
        m.setMatrixAt(h * 4 + s, object.matrix)
        y += height + 0.02
      })
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.28, 1, 0.28]} />
      <meshStandardMaterial roughness={0.55} metalness={0.1} />
    </instancedMesh>
  )
}

/** Dashed link from the supervisor down to the call they are listening to. */
function ListenLink() {
  const dashes = useRef<(THREE.Mesh | null)[]>([])
  const time = useStageTime()
  const N = 7
  const top = SUPERVISOR[1] - 0.05
  const bottom = 0.55
  useFrame((state) => {
    const t = time(state)
    dashes.current.forEach((d, i) => {
      if (!d) return
      const u = ((i / N + t * 0.35) % 1 + 1) % 1
      d.position.y = top - u * (top - bottom)
    })
  })
  return (
    <group position={[SUPERVISOR[0], 0, LANES[SUPERVISED]]}>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(m) => void (dashes.current[i] = m)}>
          <boxGeometry args={[0.02, 0.07, 0.02]} />
          <meshBasicMaterial color={palette.brandSoft} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export function WhiteLabelScene() {
  const time = useStageTime()
  const leds = useRef<(THREE.MeshBasicMaterial | null)[]>([])

  useFrame((state) => {
    const t = time(state)
    // Each call qualifies at a different moment and stays green for a while.
    leds.current.forEach((m, i) => {
      if (!m) return
      const p = (t + i * 1.7) % 5.1
      m.color.set(p > 3.2 ? palette.ok : palette.fg4)
    })
  })

  return (
    <group>
      {LANES.map((z, i) => (
        <group key={i}>
          <Chip position={[-3.15, 0, z]} size={[0.8, 0.08, 0.42]} edge={palette.brand} />
          <mesh position={[(LANE_START + LANE_START + BAR_STEP * (BARS_PER_LANE - 1)) / 2, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[BAR_STEP * BARS_PER_LANE + 0.2, 0.3]} />
            <meshBasicMaterial color={palette.line} toneMapped={false} />
          </mesh>
          <Chip position={[1.45, 0, z]} size={[0.9, 0.08, 0.42]}>
            <mesh position={[-0.32, 0.095, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial ref={(m) => void (leds.current[i] = m)} color={palette.fg4} toneMapped={false} />
            </mesh>
          </Chip>
        </group>
      ))}
      <Waveforms />

      <Chip position={SUPERVISOR} size={[0.7, 0.08, 0.42]} edge={palette.brandSoft}>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.13, 0.018, 8, 32, Math.PI]} />
          <meshBasicMaterial color={palette.brandSoft} toneMapped={false} />
        </mesh>
      </Chip>
      <Glow position={[SUPERVISOR[0], SUPERVISOR[1] + 0.15, SUPERVISOR[2]]} color={palette.brandSoft} scale={1.2} opacity={0.35} />
      <ListenLink />

      <mesh position={[CHART_X0 + ((HOURS.length - 1) * CHART_STEP) / 2, 0.004, CHART_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HOURS.length * CHART_STEP + 0.3, 0.5]} />
        <meshBasicMaterial color={palette.line} toneMapped={false} />
      </mesh>
      <HourlyChart />
    </group>
  )
}
