import path from 'path'

// Project root resolution: __dirname / __filename are not safely available
// because Storybook loads main.js through esbuild-register which auto-injects
// CJS globals at top level (causing "already declared" if we shim them) but
// the webpackFinal callback runs in pure ESM context where they're undefined.
// process.cwd() is reliably the project root when storybook is invoked via
// `yarn start:storybook` / `yarn build:storybook`.
const projectRoot = process.cwd()

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  // Story discovery — preserved from MainFactory's default story paths.
  // MDX patterns dropped: no .mdx files in this repo and SB 9 will remove MDX1.
  // *.stories.* pattern dropped: this repo only uses *.story.* (singular).
  stories: ['../src/**/*.story.@(js|jsx|ts|tsx)'],

  // Addons — SB 9 collapsed `addon-essentials` (controls, actions, viewport,
  // backgrounds, measure, outline, toolbars, docs) and `addon-interactions`
  // into core. Only addon-links and the SWC compiler remain as separate
  // installs. The SWC compiler is required because SB 9 still ships no
  // babel-loader by default; removing it would re-trigger the "Module parse
  // failed: Unexpected token" errors on `import type` / JSX in story files.
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-webpack5-compiler-swc',
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

  // Webpack — preserves three contributions:
  //   1. resolveAliasEmotion (legacy @emotion/core + emotion-theming aliases)
  //   2. src/ + node_modules added to resolve.modules.
  //   3. SVG → React component handling via @svgr/webpack. CRA used to wire
  //      this up automatically so `import { ReactComponent as Icon } from
  //      './foo.svg'` returned a real React component. SB 8 with the SWC
  //      compiler ships no SVG handler — without this rule, ReactComponent
  //      imports resolve to undefined and icons render as empty wrappers.
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.modules = [
      path.resolve(projectRoot, 'src'),
      path.resolve(projectRoot, 'node_modules'),
    ]
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      src: path.resolve(projectRoot, 'src'),
      '@emotion/core': path.resolve(projectRoot, 'node_modules/@emotion/react'),
      'emotion-theming': path.resolve(projectRoot, 'node_modules/@emotion/react'),
    }

    // Exclude .svg from any pre-existing asset/file rule so @svgr/webpack
    // is the sole handler. Without this, the asset rule wins and SVGs resolve
    // to URLs instead of React components.
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    for (const rule of config.module.rules) {
      if (rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg')) {
        rule.exclude = /\.svg$/
      }
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // Match CRA's import shape so the codebase's existing
            // `import { ReactComponent as Icon } from './foo.svg'` pattern
            // resolves to a React component without per-file refactor.
            // svgr 8 changed the default to a single default export; these
            // two options restore the named export.
            exportType: 'named',
            namedExport: 'ReactComponent',
            svgo: false,
            titleProp: true,
            ref: true,
          },
        },
      ],
    })

    return config
  },
}

export default config
