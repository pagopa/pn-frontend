const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["@pagopa-pn/pn-commons"]);
const { withGlobalCss } = require('next-global-css')

const withConfig = withGlobalCss();
const webpackNodeExternals = require('webpack-node-externals');

module.exports = withPlugins([withTM(), withConfig()], {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config, options) => {
    // custom webpack config
    if (options.isServer) {
      config.externals = webpackNodeExternals({
        // Uses list to add this modules for server bundle and process.
        allowlist: [/@pagopa\/mui-italia/],
      });
    }
    return config;
  },
});
