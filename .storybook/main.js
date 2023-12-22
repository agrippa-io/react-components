import path from 'path'
import {
  MainFactory
} from '@agrippa-io/storybook-mui-5/dist/factories'

export const storybookMainConfig = MainFactory({
  core: {
    "builder": "webpack5",
  },
  docs: "automatic",
  addons: [
    // '@storybook/addon-viewport',
    // {
    //   name: '@storybook/addon-docs',
    //   options: {
    //     configureJSX: true,
    //     babelOptions: {},
    //     sourceLoaderOptions: null,
    //     transcludeMarkdown: true,
    //   },
    // },
    // '@storybook/addon-controls',
    // '@storybook/addon-backgrounds',
    // '@storybook/addon-toolbars',
    // '@storybook/addon-measure',
    // '@storybook/addon-outline',
  ],
  webpackFinal: async (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
    ];

    return config
  }
});

console.log('storybookMainConfig', storybookMainConfig)

export const framework = {
  name: '@storybook/react-webpack5',
  options: {}
};

export const docs = {
  autodocs: true
};

export const typescript = {
  reactDocgen: 'react-docgen-typescript'
};

export const stories = storybookMainConfig.stories
export const addons = storybookMainConfig.addons
export const features = {
  legacyMdx1: true, // 👈 Enables MDX v1 support
}
