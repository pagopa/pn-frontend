const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["@pagopa-pn/pn-commons"]);

module.exports = withPlugins([withTM()], {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    // custom webpack config
    return config;
  },
  images: {},
});
