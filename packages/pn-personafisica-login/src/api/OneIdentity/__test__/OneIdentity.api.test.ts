import { vi } from 'vitest';

import { IDPS_MOCK } from '../../../__mocks__/IDPS.mock';
import { OidcAuthorizeResponse } from '../../../models/OneIdentity';
import { OneIdentityApi } from '../OneIdentity.api';

describe('OneIdentity api tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getIdps', () => {
    it('returns list of IDPs on success', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: () => Promise.resolve(IDPS_MOCK),
      } as Response);

      const res = await OneIdentityApi.getIdps();

      expect(fetch).toHaveBeenCalledWith('https://uat.oneid.pagopa.it/idps');
      expect(res).toStrictEqual(IDPS_MOCK);
    });
  });

  describe('authorize', () => {
    const mockResponse: OidcAuthorizeResponse = {
      location: 'https://idp.example.com/login?token=abc123',
    };

    it('calls the correct URL with entityId only', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const res = await OneIdentityApi.authorize({ entityId: 'spid-idp-test' });

      expect(fetch).toHaveBeenCalledWith(
        'https://mock-api-base-url/oidc-authorize?idp=spid-idp-test'
      );
      expect(res).toStrictEqual(mockResponse);
    });

    it('appends aar param when provided', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await OneIdentityApi.authorize({ entityId: 'spid-idp-test', aar: 'aar-token-123' });

      expect(fetch).toHaveBeenCalledWith(
        'https://mock-api-base-url/oidc-authorize?idp=spid-idp-test&aar=aar-token-123'
      );
    });

    it('appends retrievalId param when aar is not provided', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await OneIdentityApi.authorize({
        entityId: 'spid-idp-test',
        retrievalId: 'retrieval-id-456',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://mock-api-base-url/oidc-authorize?idp=spid-idp-test&retrievalId=retrieval-id-456'
      );
    });

    it('throws when response is not ok', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(OneIdentityApi.authorize({ entityId: 'spid-idp-test' })).rejects.toThrow(
        'Error during OIDC authorize'
      );
    });
  });
});
