const withTM = require("next-transpile-modules")(["@pagopa/mui-italia"]);

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: true,
});
