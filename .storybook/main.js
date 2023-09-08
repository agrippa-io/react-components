const {
  MainFactory
} = require('@agrippa-io/storybook-mui-5/dist/factories');

const storybookMainConfig = MainFactory({
  framework: "@storybook/react",
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
  ]
});

console.log('storybookMainConfig', storybookMainConfig)

module.exports = storybookMainConfig;
