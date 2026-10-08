/**
 * Avortyx 3D: three.js background scenes, kept apart from the page code.
 *
 *   SceneBackdrop.tsx   the background layer (no three.js import; safe in any chunk)
 *   BackdropCanvas.tsx  the WebGL canvas, loaded lazily: camera rig, parallax, fog, lights, floor
 *   config.ts           per-scene camera, fog and still frame
 *   palette.ts          scene colours read from the design tokens
 *   primitives.tsx      shared building blocks: floor, chips, hairline traces, gates, glows, trailed packets
 *   scenes/             the ambient call field plus one scene per service; each a pure function of time
 *
 * To add a scene: write scenes/<Name>Scene.tsx, register it in scenes/index.ts,
 * and add its entry to config.ts.
 */
export { SceneBackdrop } from './SceneBackdrop'
export { backdropConfigs, type BackdropConfig, type SceneId } from './config'
