import { createCn } from 'cn/config'

/**
 * Class joining + Tailwind conflict resolution.
 * The Avortyx Night scales in index.css are registered here so that, e.g.,
 * `text-caption text-fg-2` keeps both classes instead of reading `caption` as a colour.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['label', 'caption', 'h3', 'h2', 'h1', 'display', 'display-xl'] },
      ],
      tracking: [{ tracking: ['display', 'heading', 'label'] }],
      shadow: [{ shadow: ['e1', 'e2', 'e3', 'glow', 'cta'] }],
    },
  },
})
