import { addParamToUrl } from "../navigation.utility";

describe('Test addParamToUrl', () => {
  it('adds param to an url having an empty query string', () => {
    expect(addParamToUrl('https://www.pagopa.it', 'data', 'test')).toBe(
      'https://www.pagopa.it?data=test'
    );
  });

  it('adds param to an url already having a query param', () => {
    expect(addParamToUrl('https://www.pagopa.it?lang=it', 'data', 'test')).toBe(
      'https://www.pagopa.it?lang=it&data=test'
    );
  });

  it('does not add the param if its value is empty', () => {
    expect(addParamToUrl('https://www.pagopa.it', 'data', '')).toBe('https://www.pagopa.it');
  });

  it('properly encodes paramValue', () => {
    expect(addParamToUrl('https://www.pagopa.it', 'data', 'encode test!')).toBe(
      'https://www.pagopa.it?data=encode%20test%21'
    );
  });
});