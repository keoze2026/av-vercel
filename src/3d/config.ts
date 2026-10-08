import type { ProductId } from '@/data/products'

export type Vec3 = [number, number, number]

/** A service scene, or the ambient call field behind the home hero. */
export type SceneId = ProductId | 'ambient'

export interface BackdropConfig {
  camera: { position: Vec3; target: Vec3; fov: number }
  /** Scene time (s) shown first, and held as the still frame under reduced motion. */
  stillTime: number
  /**
   * Pull the camera back on stages narrower than the composition (keeps a whole
   * scene in frame). Off for the ambient field, which is meant to fill the view.
   */
  fit: boolean
  /** Fog near / far distances (scaled with the camera when it pulls back). */
  fog: [number, number]
}

/** One backdrop per scene. Everything shown is sample data. */
export const backdropConfigs: Record<SceneId, BackdropConfig> = {
  ambient: {
    camera: { position: [0, 1.7, 6.5], target: [0, 0.75, -8], fov: 52 },
    stillTime: 6,
    fit: false,
    fog: [10, 44],
  },
  tracking: {
    camera: { position: [0.6, 4.4, 6.2], target: [0, 0, 0], fov: 40 },
    stillTime: 2.1,
    fit: true,
    fog: [8, 18],
  },
  ivr: {
    camera: { position: [0.2, 4.6, 6.4], target: [-0.3, 0, 0], fov: 40 },
    stillTime: 2.6,
    fit: true,
    fog: [8, 18],
  },
  ringtree: {
    camera: { position: [0.2, 2.9, 6.6], target: [0, 0.7, 0], fov: 40 },
    stillTime: 3.4,
    fit: true,
    fog: [8, 18],
  },
  pingpost: {
    camera: { position: [0.4, 3.6, 6.4], target: [0, 0.5, 0], fov: 40 },
    stillTime: 3.0,
    fit: true,
    fog: [8, 18],
  },
  whitelabel: {
    camera: { position: [0.4, 3.8, 6.2], target: [-0.4, 0.3, -0.4], fov: 42 },
    stillTime: 1.5,
    fit: true,
    fog: [8, 18],
  },
  fraud: {
    camera: { position: [0.3, 3.4, 6.4], target: [0, 0.3, 0], fov: 40 },
    stillTime: 3.2,
    fit: true,
    fog: [8, 18],
  },
}
