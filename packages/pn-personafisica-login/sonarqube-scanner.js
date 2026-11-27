const options = {
  'sonar.organization': 'pagopa',
  'sonar.projectKey': 'pagopa_pn-personafisica-login',
};

if (typeof process.env.PR_NUM !== 'undefined') {
  options['sonar.pullrequest.base'] = process.env.BRANCH_TARGET;
  options['sonar.pullrequest.branch'] = process.env.BRANCH_NAME;
  options['sonar.pullrequest.key'] = process.env.PR_NUM;
} else {
  options['sonar.branch.name'] = process.env.BRANCH_NAME;
  options['sonar.branch.target'] = process.env.BRANCH_TARGET;
}

async function runScanner() {
  try {
    const { default: scanner } = await import('sonarqube-scanner');

    scanner(
      {
        serverUrl: 'https://sonarcloud.io',
        token: process.env.SONAR_TOKEN,
        options,
      },
      (error) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }
        process.exit();
      }
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

runScanner();
