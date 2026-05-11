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
      // external: [...Object.keys(peerDependencies)], // Defines external dependencies for Rollup bundling.
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
    dts(),
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
