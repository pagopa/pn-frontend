const withTM = require("next-transpile-modules")(["@pagopa/mui-italia"]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,

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
