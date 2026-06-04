/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
// import { peerDependencies } from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts', // Specifies the entry point for building the library.
      name: '@agrippa-io/react-components', // Sets the name of the generated library.
      fileName: (format) => `index.${format}.js`, // Generates the output file name based on the format.
      formats: ['cjs', 'es'], // Specifies the output formats (CommonJS and ES modules).
    },
    rollupOptions: {
      // Externalize consumer-controlled packages so the published library
      // does not embed its own copies of React / MUI / Emotion / Redux /
      // react-hook-form. Without this, consumers get duplicate React
      // instances (causing "Invalid hook call" errors when the host app's
      // React version differs by even a patch), duplicate MUI theme
      // contexts, and a ~2 MB unminified bundle.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-redux',
        'react-hook-form',
        '@faire/mjml-react',
        /^@faire\/mjml-react\//,
        'mjml',
        'mjml-browser',
        'react-input-mask',
        /^@emotion\//,
        /^@mui\//,
        /^@reduxjs\//,
      ],
    },
    sourcemap: true, // Generates source maps for debugging.
    emptyOutDir: true, // Clears the output directory before building.
  },
  plugins: [
    svgr({
      svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
    react(),
    // Generate .d.ts only for the publishable library surface. Without an
    // explicit config, dts() falls back to the root tsconfig.json (which only
    // excludes node_modules) and tries to emit declarations for every file
    // under src — including stories and tests. The story files import
    // `@storybook/react-vite`, whose package.json `exports` map can't be
    // resolved under `moduleResolution: "node"`, and the test files reference
    // vitest globals — both fail the dts pass and break `yarn build`. Point dts
    // at tsconfig.prod.json (which already excludes these) and exclude them
    // explicitly so the build never regresses if that tsconfig changes.
    dts({
      tsconfigPath: './tsconfig.prod.json',
      // Root the emitted declarations at `src` so the entry lands at
      // dist/index.d.ts (matching package.json `types`). Without this, dts
      // computes the entry root as the common ancestor of all included files —
      // and because tsconfig.prod.json's `include` spans both `src` and
      // `@types/svg.d.ts`, that ancestor is the repo root, pushing the entry to
      // dist/src/index.d.ts where consumers' TypeScript can't find it.
      entryRoot: 'src',
      exclude: [
        '**/*.story.tsx',
        '**/*.stories.tsx',
        '**/storybook/**',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    }),
  ], // Uses the 'vite-plugin-dts' plugin for generating TypeScript declaration files (d.ts).
  test: {
    // Two parallel projects share this config:
    //   - "unit" runs the existing src/**/*.test.ts(x) suite under jsdom
    //     (51 tests across 10 files). No change from the previous behavior.
    //   - "storybook" runs every story file under @storybook/addon-vitest's
    //     browser runner (Playwright/Chromium). Each story becomes a smoke
    //     test that fails if the component throws on mount; stories with
    //     `play()` blocks also have their interactions executed and asserted.
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: './setupTests.ts',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['node_modules', 'storybook-static', 'src/**/*.story.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
