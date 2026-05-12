import path from 'path'
import svgr from 'vite-plugin-svgr'

// Project root resolution: __dirname / __filename are not safely available
// because Storybook loads main.js through esbuild-register which auto-injects
// CJS globals at top level (causing "already declared" if we shim them) but
// the viteFinal callback runs in pure ESM context where they're undefined.
// process.cwd() is reliably the project root when storybook is invoked via
// `yarn start:storybook` / `yarn build:storybook`.
const projectRoot = process.cwd()

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Story discovery — preserved from MainFactory's default story paths.
  // MDX patterns dropped: no .mdx files in this repo and SB 9 will remove MDX1.
  // *.stories.* pattern dropped: this repo only uses *.story.* (singular).
  stories: ['../src/**/*.story.@(js|jsx|ts|tsx)'],

  // Addons — SB 9 collapsed `addon-essentials` (controls, actions, viewport,
  // backgrounds, measure, outline, toolbars, docs) and `addon-interactions`
  // into core. Only addon-links and addon-vitest remain as separate installs.
  // Vite handles TypeScript/JSX natively via esbuild, so the SWC compiler
  // addon that the webpack5 builder required is not needed here.
  //
  // addon-vitest runs every story as a Vitest test (smoke test by default,
  // plus any `play()` interaction blocks). Vitest config + browser setup
  // live in `vitest.config.ts` and `.storybook/vitest.setup.ts`.
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp'
  ],

  // Autodocs is now driven by `tags: ['autodocs']` declared globally in
  // preview.js. The previous `docs.autodocs: true` field is deprecated in
  // SB 8 and removed in SB 9.

  // SB 8 removed the `-s <dir>` / `--static-dir` CLI flag. Static assets are
  // declared here instead. Preserves the previous `storybook dev -s public`
  // and `storybook build -s public` behavior.
  staticDirs: ['../public'],

  // TypeScript / docgen config — preserved from MainFactory's TYPESCRIPT_DEFAULT_CONFIG.
  // propFilter keeps mui types but excludes other node_modules noise.
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      allowSyntheticDefaultImports: false,
      esModuleInterop: false,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName) : true,
    },
  },

  // Vite — preserves all three contributions from the previous webpack setup:
  //   1. Emotion legacy aliases (@emotion/core + emotion-theming → @emotion/react)
  //   2. `src` alias so absolute `import x from 'src/foo'` works
  //   3. SVG → React component handling via vite-plugin-svgr (CRA-compatible
  //      `import { ReactComponent as Icon } from './foo.svg'` shape).
  //
  // Mirrors the project's existing `vite.config.ts` library build so dev
  // (Storybook) and prod (library) resolve modules and transform SVGs the
  // same way — no surprises when a story works locally but the published
  // component doesn't.
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      src: path.resolve(projectRoot, 'src'),
      '@emotion/core': path.resolve(projectRoot, 'node_modules/@emotion/react'),
      'emotion-theming': path.resolve(projectRoot, 'node_modules/@emotion/react'),
      // @faire/mjml-react's render() does require('mjml'), but the mjml
      // package is Node-only (fs, fetch, etc.). Re-point it at mjml-browser
      // so email templates can be compiled inside the Storybook iframe.
      mjml: path.resolve(projectRoot, 'node_modules/mjml-browser'),
      // @faire/mjml-react/utils/renderToMjml uses react-dom/server's
      // renderToStaticMarkup. Vite resolves the bare "react-dom/server"
      // specifier to server.node.js (which pulls in `stream`, `os`, etc.).
      // Pin it to the browser build that React 18+ ships for this exact case.
      'react-dom/server': path.resolve(projectRoot, 'node_modules/react-dom/server.browser.js'),
    }

    config.plugins = config.plugins || []
    config.plugins.push(
      svgr({
        svgrOptions: {
          exportType: 'named',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: '**/*.svg',
      }),
    )

    // Chunk the storybook-static build so the main iframe.js doesn't end up
    // a single >1 MB blob (Vite's default warning threshold is 500 KB).
    // Splitting the heaviest vendor groups into their own chunks lets the
    // browser cache them across deploys and parallelizes the initial load.
    // Applies only to `yarn build:storybook` — `yarn start:storybook` is a
    // dev server with HMR, no production chunking.
    config.build = config.build || {}
    config.build.rollupOptions = config.build.rollupOptions || {}
    config.build.rollupOptions.output = {
      ...(config.build.rollupOptions.output || {}),
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          if (/[\\/]node_modules[\\/]@mui[\\/]/.test(id)) return 'vendor-mui'
          if (/[\\/]node_modules[\\/]@emotion[\\/]/.test(id)) return 'vendor-emotion'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (/[\\/]node_modules[\\/](@reduxjs|react-redux|redux)[\\/]/.test(id)) return 'vendor-redux'
          if (/[\\/]node_modules[\\/]storybook[\\/]/.test(id)) return 'vendor-storybook'
        }
      },
    }

    return config
  },
}

export default config
