const scanner = require('sonarqube-scanner');
const options = {
  'sonar.organization': 'pagopa',
  'sonar.projectKey': 'pagopa_pn-fe-commons',
};

// if (typeof process.env.PR_NUM !== 'undefined' ) {
//   options["sonar.pullrequest.base"] = process.env.BRANCH_TARGET;
//   options["sonar.pullrequest.branch"] = process.env.BRANCH_NAME;
//   options["sonar.pullrequest.key"] = process.env.PR_NUM;
// }

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    options,
  },
  () => process.exit()
);
