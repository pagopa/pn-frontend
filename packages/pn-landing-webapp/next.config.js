const withTM = require("next-transpile-modules")(["@pagopa/mui-italia"]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
});
