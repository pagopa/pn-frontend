// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

beforeAll(async () => {
  const pnCommonsApi = await import('@pagopa-pn/pn-commons');

  pnCommonsApi.Configuration.setForTest<any>({
    "MIXPANEL_TOKEN": "DUMMY",
    "ONE_TRUST_DRAFT_MODE": false,
    "ONE_TRUST_PP": "mocked-id",
    "OT_DOMAIN_ID": "fd5aef6f-a6d3-422b-87b7-aa5e2cb6510c",
    "PAGOPA_HELP_EMAIL": "assistenza@pn.it",
    "PF_URL": "https://portale.dev.pn.pagopa.it",
    "PG_URL": "https://portale-pg.dev.pn.pagopa.it",
    "PUBLIC_URL": "",
    "SPID_TEST_ENV_ENABLED": true,
    "SPID_VALIDATOR_ENV_ENABLED": true,
    "SPID_CIE_ENTITY_ID": "xx_servizicie_test",
    "URL_API_LOGIN": "https://hub-login.spid.svil.pn.pagopa.it"
  });
})