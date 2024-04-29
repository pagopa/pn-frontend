import {
  beAppStatusKO,
  beAppStatusOK,
  beDowntimeHistoryWithIncidents,
} from '../../__mocks__/AppStatus.mock';
import {
  BadApiDataException,
  validateCurrentStatus,
  validateHistory,
  validateLegaFact,
} from '../appStatus.utility';

describe('test appStatus utility', () => {
  it('validate OK status', async () => {
    const res = validateCurrentStatus(beAppStatusOK);
    expect(res).toBeUndefined();
  });

  it('validate KO status', async () => {
    const res = validateCurrentStatus(beAppStatusKO);
    expect(res).toBeUndefined();
  });

  it('validate status - invalid date', async () => {
    expect(() =>
      validateCurrentStatus({ ...beAppStatusOK, lastCheckTimestamp: 'fake-string' })
    ).toThrow(BadApiDataException);
  });

  it('validate history', async () => {
    const res = validateHistory(beDowntimeHistoryWithIncidents);
    expect(res).toBeUndefined();
  });

  it('validate history - invalid data', async () => {
    expect(() =>
      validateHistory({
        result: [{ ...beDowntimeHistoryWithIncidents.result[0], startDate: 'fake-string' }],
      })
    ).toThrow(BadApiDataException);
  });

  it('validate history - downtime with fileAvailable but without legalFactId', async () => {
    expect(() =>
      validateHistory({
        result: [{ ...beDowntimeHistoryWithIncidents.result[0], legalFactId: undefined }],
      })
    ).toThrow(BadApiDataException);
  });

  it('validate legal fact', async () => {
    const res = validateLegaFact({
      url: 'https://www.legal-fact.com',
      filename: 'fake-legalfact',
      contentLength: 10,
    });
    expect(res).toBeUndefined();
  });

  it('validate legal fact - no url', async () => {
    expect(() =>
      validateLegaFact({
        url: '',
        filename: 'fake-legalfact',
        contentLength: 10,
      })
    ).toThrow(BadApiDataException);
  });
});
