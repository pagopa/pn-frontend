// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

beforeAll(async () => {
  const { Configuration } = await import('@pagopa-pn/pn-commons');

  Configuration.setForTest<any>({
    MIXPANEL_TOKEN: 'ba1f5101fe34a61bb125cbfe587780d8',
    OT_DOMAIN_ID: 'fd5aef6f-a6d3-422b-87b7-aa5e2cb6510c-test',
    PAGOPA_HELP_EMAIL: 'destinatari-send@assistenza.pagopa.it',
    PF_URL: 'https://cittadini.dev.notifichedigitali.it',
    PUBLIC_URL: '',
    SPID_TEST_ENV_ENABLED: true,
    SPID_VALIDATOR_ENV_ENABLED: true,
    SPID_CIE_ENTITY_ID: 'xx_servizicie_test',
    URL_API_LOGIN: 'https://hub-login.spid.dev.notifichedigitali.it',
  });
});
