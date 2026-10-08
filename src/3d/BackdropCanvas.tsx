import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { backdropConfigs, type SceneId, type Vec3 } from './config'
import { palette } from './palette'
import { Floor, StageTimeContext, Sway } from './primitives'
import { scenes } from './scenes'

/** Scenes are composed for a desktop stage; narrower stages pull the camera back. */
const DESIGN_ASPECT = 1.8
/** Backdrops run slower than real time: calm, never busy. */
const BACKDROP_SPEED = 0.6
/** How far the camera eases toward the pointer, in scene units. */
const PARALLAX = { x: 0.35, y: 0.16 }

/** Pointer position across the viewport, -1…1, shared by every backdrop. */
const pointer = { x: 0, y: 0 }
let pointerListeners = 0
const onPointerMove = (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1
}

interface RigProps {
  position: Vec3
  target: Vec3
  fov: number
  fit: boolean
  fog: [number, number]
  parallax: boolean
}

/** Frames the scene for the stage size, then drifts gently with the pointer. */
function CameraRig({ position, target, fov, fit, fog, parallax }: RigProps) {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height))
  const base = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(...target), [target])
  const drift = useRef({ x: 0, y: 0 })

  useLayoutEffect(() => {
    const distance = fit ? Math.min(2.2, Math.max(1, (DESIGN_ASPECT / aspect) ** 0.85)) : 1
    base.set(
      target[0] + (position[0] - target[0]) * distance,
      target[1] + (position[1] - target[1]) * distance,
      target[2] + (position[2] - target[2]) * distance,
    )
    camera.position.copy(base)
    camera.lookAt(look)
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = fog[0] * distance
      scene.fog.far = fog[1] * distance
    }
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    invalidate()
  }, [camera, scene, invalidate, base, look, position, target, fov, fit, fog, aspect])

  useFrame(() => {
    if (!parallax) return
    drift.current.x += (pointer.x * PARALLAX.x - drift.current.x) * 0.035
    drift.current.y += (-pointer.y * PARALLAX.y - drift.current.y) * 0.035
    camera.position.set(base.x + drift.current.x, base.y + drift.current.y, base.z)
    camera.lookAt(look)
  })
  return null
}

/** Draws at most `fps` frames a second (used on phones to save battery). */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    let id = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now
        invalidate()
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [fps, invalidate])
  return null
}

/** Reports the first rendered frame, so the backdrop can fade in over nothing. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(onReady)
  })
  return null
}

export interface BackdropCanvasProps {
  scene: SceneId
  /** Runs the loop; when false a single still frame is drawn. */
  playing: boolean
  /** Lighter settings for phones: DPR ≤ 1.25, no MSAA, 30 fps. */
  lite: boolean
  /** Fog colour: the background the backdrop sits on. */
  fog?: string
  onReady: () => void
}

/**
 * The WebGL backdrop. Loaded lazily by SceneBackdrop, so three.js never ships
 * in a page chunk. Transparent, non-interactive, fogged into the page.
 */
export default function BackdropCanvas({ scene, playing, lite, fog = palette.canvas, onReady }: BackdropCanvasProps) {
  const config = backdropConfigs[scene]
  const Scene = scenes[scene]

  useEffect(() => {
    if (pointerListeners++ === 0) window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      if (--pointerListeners === 0) window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 2]}
      frameloop={playing && !lite ? 'always' : 'demand'}
      camera={{ position: config.camera.position, fov: config.camera.fov, near: 0.1, far: 60 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'default' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {playing && lite && <FrameLimiter fps={30} />}
      <FirstFrame onReady={onReady} />
      <CameraRig {...config.camera} fit={config.fit} fog={config.fog} parallax={playing && !lite} />
      <fog attach="fog" args={[fog, config.fog[0], config.fog[1]]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 6, 4]} intensity={1.1} />
      <directionalLight position={[4, 3, -3]} intensity={0.35} color={palette.brandSoft} />
      <StageTimeContext.Provider value={{ offset: config.stillTime, speed: BACKDROP_SPEED }}>
        <Floor fadeDistance={scene === 'ambient' ? 34 : 18} />
        {scene === 'ambient' ? (
          <Scene />
        ) : (
          <Sway>
            <Scene key={scene} />
          </Sway>
        )}
      </StageTimeContext.Provider>
    </Canvas>
  )
}
