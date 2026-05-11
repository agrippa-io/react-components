// Single import registers both the jest-dom matchers and the TypeScript
// module augmentation for Vitest's `expect` (no manual `expect.extend` call,
// no reference to the deprecated `jest.Matchers` type). This is the
// jest-dom v6+ Vitest-native setup path.
import '@testing-library/jest-dom/vitest'
