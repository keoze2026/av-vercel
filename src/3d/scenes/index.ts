import type { ComponentType } from 'react'
import type { SceneId } from '../config'
import { AmbientScene } from './AmbientScene'
import { FraudScene } from './FraudScene'
import { IvrScene } from './IvrScene'
import { PingPostScene } from './PingPostScene'
import { RingTreeScene } from './RingTreeScene'
import { TrackingScene } from './TrackingScene'
import { WhiteLabelScene } from './WhiteLabelScene'

/** Every scene. All of them live in the lazily loaded canvas chunk. */
export const scenes: Record<SceneId, ComponentType> = {
  ambient: AmbientScene,
  tracking: TrackingScene,
  ivr: IvrScene,
  ringtree: RingTreeScene,
  pingpost: PingPostScene,
  whitelabel: WhiteLabelScene,
  fraud: FraudScene,
}
