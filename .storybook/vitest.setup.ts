import { beforeAll } from 'vitest'
import { setProjectAnnotations } from '@storybook/react-vite'

// Pull global preview annotations (parameters, decorators, global tags) from
// .storybook/preview.js so every story-as-test runs with the same config as
// the Storybook UI — same `controls` matchers, same global `autodocs` tag,
// same font CSS imports, etc.
//
// Without this, a story that depends on a decorator (e.g. theme provider)
// would render bare in the test runner and behave differently than it does
// in the Storybook canvas.
import * as previewAnnotations from './preview'

const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)
