import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useFrame, type RootState } from '@react-three/fiber'
import { Grid, Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Line2, LineSegments2 } from 'three-stdlib'
import type { Vec3 } from './config'
import { palette } from './palette'

/* ── Time ─────────────────────────────────────────────────────────────────
   Scenes are pure functions of scene time. The stage sets an offset (so the
   first frame shows a call mid-flow) and a speed (backdrops run slower). */

export interface StageTime {
  offset: number
  speed: number
}

export const StageTimeContext = createContext<StageTime>({ offset: 0, speed: 1 })

/** Returns a reader for scene time in seconds. */
export function useStageTime() {
  const { offset, speed } = useContext(StageTimeContext)
  return (state: RootState) => offset + state.clock.elapsedTime * speed
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** 0 → 1 as `t` moves from `a` to `b`, eased. */
export const ramp = (t: number, a: number, b: number) => THREE.MathUtils.smootherstep(t, a, b)
/** Deterministic 0–1 hash, so every loop of a scene is reproducible. */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/* ── Geometry helpers ───────────────────────────────────────────────────── */

export function makeCurve(points: Vec3[]) {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    false,
    'centripetal',
  )
}

/** A raised arc from `a` to `b`, the shape every signal trace uses. */
export function arc(a: Vec3, b: Vec3, lift = 0.35) {
  const mid: Vec3 = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + lift, (a[2] + b[2]) / 2]
  return makeCurve([a, mid, b])
}

/* ── Stage furniture ────────────────────────────────────────────────────── */

/** The floor grid, fading into the fog like the site's background grid. */
export function Floor({ fadeDistance = 18 }: { fadeDistance?: number }) {
  return (
    <Grid
      position={[0, -0.001, 0]}
      args={[40, 40]}
      cellSize={0.5}
      cellThickness={0.55}
      cellColor={palette.line}
      sectionSize={2}
      sectionThickness={0.9}
      sectionColor={palette.lineStrong}
      fadeDistance={fadeDistance}
      fadeStrength={1.8}
      infiniteGrid
    />
  )
}

/** Very slow sway so the stage reads as 3D without demanding attention. */
export function Sway({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const time = useStageTime()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(time(state) * 0.12) * 0.06
  })
  return <group ref={group}>{children}</group>
}

/* ── Building blocks ────────────────────────────────────────────────────── */

interface ChipProps {
  position: Vec3
  size?: Vec3
  edge?: string
  children?: ReactNode
}

/** A console chip: a dark slab with a hairline edge. */
export const Chip = forwardRef<THREE.Group, ChipProps>(function Chip(
  { position, size = [0.8, 0.08, 0.4], edge = palette.lineStrong, children },
  ref,
) {
  const [w, h, d] = size
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d])
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={palette.raised} roughness={0.7} metalness={0.2} />
      </mesh>
      <lineSegments geometry={edges} position={[0, h / 2, 0]}>
        <lineBasicMaterial color={edge} transparent opacity={0.9} />
      </lineSegments>
      {children}
    </group>
  )
})

/** What a scene may animate on a trace: its colour and opacity. */
export interface TraceMaterial {
  color: THREE.Color
  opacity: number
}

interface TraceProps {
  curve: THREE.Curve<THREE.Vector3>
  color?: string
  opacity?: number
  /** Width in CSS pixels; stays crisp at any distance. */
  width?: number
}

/** An anti-aliased hairline along a curve. The ref exposes its material. */
export const Trace = forwardRef<TraceMaterial, TraceProps>(function Trace(
  { curve, color = palette.lineStrong, opacity = 0.9, width = 1.25 },
  ref,
) {
  const line = useRef<Line2 | LineSegments2>(null)
  const points = useMemo(() => curve.getPoints(64), [curve])
  // The line exists once mounted; its material carries colour and opacity uniforms.
  useImperativeHandle(ref, () => line.current!.material as unknown as TraceMaterial, [])
  return (
    <Line
      ref={line}
      points={points}
      color={color}
      lineWidth={width}
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped={false}
    />
  )
})

/**
 * Additive light that never writes alpha. On a transparent canvas plain additive
 * blending also raises alpha, so a dim halo would show as a dark patch over the
 * page; with this it can only ever brighten what is behind it.
 */
export const lightBlending = {
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
} as const

/** Radial gradient texture shared by every glow. */
let glowTexture: THREE.Texture | null = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.12, 'rgba(255,255,255,0.75)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

interface GlowProps {
  position?: Vec3
  color?: string
  scale?: number
  opacity?: number
}

/** Soft additive light, used sparingly on live nodes. */
export const Glow = forwardRef<THREE.Sprite, GlowProps>(function Glow(
  { position = [0, 0, 0], color = palette.brand, scale = 1, opacity = 0.6 },
  ref,
) {
  const map = useMemo(() => getGlowTexture(), [])
  return (
    <sprite ref={ref} position={position} scale={[scale, scale, scale]}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
        {...lightBlending}
      />
    </sprite>
  )
})

interface PulseRingProps {
  position: Vec3
  color?: string
  period?: number
  /** Seconds added to scene time before taking the phase. */
  phase?: number
  size?: number
}

/** A ring on the floor that expands and fades on a fixed period. */
export function PulseRing({ position, color = palette.brand, period = 1.2, phase = 0, size = 0.5 }: PulseRingProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const time = useStageTime()
  useFrame((state) => {
    if (!mesh.current) return
    const p = (((time(state) + phase) % period) + period) % period / period
    mesh.current.scale.setScalar(0.35 + p * 1.4)
    const material = mesh.current.material as THREE.MeshBasicMaterial
    material.opacity = (1 - p) * (1 - p) * 0.6
  })
  return (
    <mesh ref={mesh} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * 0.94, size, 64]} />
      <meshBasicMaterial color={color} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ── Packets: the calls themselves ──────────────────────────────────────── */

export interface PacketState {
  position: THREE.Vector3
  color: THREE.Color
  /** 0 hides the packet. */
  scale: number
}

interface PacketsProps {
  count: number
  radius?: number
  /** Size of the soft halo around each call, in scene units. */
  glow?: number
  /** Trail samples behind each call. */
  trail?: number
  /** Called for every packet at scene time `t`; write into `out`. Must be pure in `t`. */
  update: (index: number, t: number, out: PacketState) => void
}

/** Scene-time gap between trail samples. */
const TRAIL_STEP = 0.045

/**
 * Calls as small bright cores with a soft halo and a fading light trail.
 * Trails are the same pure `update` sampled slightly in the past, so they
 * follow every curve exactly. Two draw calls regardless of count.
 */
export function Packets({ count, radius = 0.045, glow = 0.5, trail = 7, update }: PacketsProps) {
  const cores = useRef<THREE.InstancedMesh>(null)
  const time = useStageTime()
  const perPacket = trail + 1
  const total = count * perPacket

  const scratch = useMemo(
    () => ({
      object: new THREE.Object3D(),
      head: { position: new THREE.Vector3(), color: new THREE.Color(), scale: 1 } as PacketState,
      sample: { position: new THREE.Vector3(), color: new THREE.Color(), scale: 1 } as PacketState,
    }),
    [],
  )

  const halo = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(total * 3), 3))
    return geometry
  }, [total])
  const map = useMemo(() => getGlowTexture(), [])

  // Create the instance colour attribute before the first frame so the shader includes it.
  useLayoutEffect(() => {
    const m = cores.current
    if (!m) return
    const white = new THREE.Color('#ffffff')
    for (let i = 0; i < count; i += 1) m.setColorAt(i, white)
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count])

  useFrame((state) => {
    const m = cores.current
    if (!m) return
    const t = time(state)
    const { object, head, sample } = scratch
    const positions = halo.attributes.position.array as Float32Array
    const colors = halo.attributes.color.array as Float32Array

    for (let i = 0; i < count; i += 1) {
      head.scale = 1
      update(i, t, head)
      object.position.copy(head.position)
      object.scale.setScalar(head.scale)
      object.updateMatrix()
      m.setMatrixAt(i, object.matrix)
      m.setColorAt(i, head.color)

      for (let k = 0; k < perPacket; k += 1) {
        const v = (i * perPacket + k) * 3
        let s: PacketState = head
        if (k > 0) {
          sample.scale = 1
          update(i, t - k * TRAIL_STEP, sample)
          s = sample
        }
        positions[v] = s.position.x
        positions[v + 1] = s.position.y
        positions[v + 2] = s.position.z
        // Additive blending: darker colour reads as a fainter, smaller point.
        // A shrinking packet dims with it, so fades never leave dark marks.
        const fade = Math.min(1, s.scale) * (k === 0 ? 0.9 : 0.42 * (1 - k / perPacket) ** 1.6)
        colors[v] = s.color.r * fade
        colors[v + 1] = s.color.g * fade
        colors[v + 2] = s.color.b * fade
      }
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    halo.attributes.position.needsUpdate = true
    halo.attributes.color.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={cores} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <points geometry={halo} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={glow}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          toneMapped={false}
          {...lightBlending}
        />
      </points>
    </group>
  )
}

/** A rectangular gate frame standing on the floor, facing along x. */
export const GateFrame = forwardRef<THREE.MeshBasicMaterial, { position: Vec3; width?: number; height?: number }>(
  function GateFrame({ position, width = 1.1, height = 0.95 }, ref) {
    const bar = 0.03
    return (
      <group position={position}>
        <mesh position={[0, height, 0]}>
          <boxGeometry args={[bar, bar, width]} />
          <meshBasicMaterial ref={ref} color={palette.brandSoft} toneMapped={false} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[0, height / 2, (side * width) / 2]}>
            <boxGeometry args={[bar, height, bar]} />
            <meshBasicMaterial color={palette.lineStrong} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[0.008, height, width]} />
          <meshBasicMaterial color={palette.brand} transparent opacity={0.07} depthWrite={false} />
        </mesh>
      </group>
    )
  },
)
