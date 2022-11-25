const {
  MainFactory
} = require('@agrippa-io/storybook-mui-5/dist/factories');

module.exports = MainFactory({
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5",
  },
  docs: "automatic",
});
