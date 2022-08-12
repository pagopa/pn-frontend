const withTM = require("next-transpile-modules")(["@pagopa/mui-italia"]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
  basePath: '/cittadini',

  async redirects() {
    return [
      {
        source: '/',
        destination: '/cittadini',
        permanent: true,
      },
    ]
  }
});
