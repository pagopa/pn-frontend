import { ServerResponseError } from '@pagopa-pn/pn-commons';
import { DeliveryMandateNotFoundAppError } from '../DeliveryMandateNotFoundAppError';

describe('Test MandateNotFoundAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return not found message', () => {
    const appError = new DeliveryMandateNotFoundAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.delivery_mandate_not_found.title deleghe');
    expect(messege.content).toBe('errors.delivery_mandate_not_found.message deleghe');
  });
});
