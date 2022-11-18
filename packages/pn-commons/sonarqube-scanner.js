const scanner = require('sonarqube-scanner');

const options = {
  'sonar.organization': 'pagopa',
  'sonar.projectKey': 'pagopa_pn-fe-commons',
};

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    options,
  },
  () => {
    console.log("Token " + process.env.SONAR_TOKEN);
    console.log("options ", options);
    console.log('Sonar has finished');
    process.exit();
  }
);
