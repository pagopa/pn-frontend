const scanner = require('sonarqube-scanner');

const options = {
  'sonar.organization': 'pagopa',
  'sonar.projectKey': 'pagopa_pn-validator',
  'sonar.sources': './src',
  'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
};


if (typeof process.env.PR_NUM !== 'undefined') {
  options['sonar.pullrequest.base'] = process.env.BRANCH_TARGET;
  options['sonar.pullrequest.branch'] = process.env.BRANCH_NAME;
  options['sonar.pullrequest.key'] = process.env.PR_NUM;
} else {
  options['sonar.branch.name'] = process.env.BRANCH_NAME;
  options['sonar.branch.target'] = process.env.BRANCH_TARGET;
}

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN,
    options,
  },
  () => process.exit()
);
