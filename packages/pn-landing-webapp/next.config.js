const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["@pagopa-pn/pn-commons"]);
const withImages = require("next-images");

module.exports = withPlugins([withTM(), withImages], {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    // custom webpack config
    return config;
  },
  images: {},
});
