const scanner = require("sonarqube-scanner");
scanner(
  {
    serverUrl: "https://sonarcloud.io",
    //token: "c44a4934f4c5a35954974b7435a0731e43992785",
    options: {
      "sonar.organization": "pagopa",
      "sonar.projectKey": "pagopa_pn-frontend",
    },
  },
  () => process.exit()
);
