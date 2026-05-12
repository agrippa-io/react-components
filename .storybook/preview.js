import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/material-icons'

/** @type {import('@storybook/react-vite').Preview} */
const preview = {
  parameters: {
    // Note: SB 7's `actions: { argTypesRegex: '^on[A-Z].*' }` was removed —
    // it auto-spied on every `on*` prop. SB 8/9 require explicit per-arg
    // wiring with `fn()` from '@storybook/test' on each meta that wants to
    // observe handler calls. Add per-story when needed.
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  // Global tags — `autodocs` here generates docs for every story, preserving
  // the original `docs.autodocs: true` behavior (deprecated in SB 8, removed
  // in SB 9). Per-story opt-out via `tags: ['!autodocs']` on a meta.
  tags: ['autodocs'],
}

export default preview
