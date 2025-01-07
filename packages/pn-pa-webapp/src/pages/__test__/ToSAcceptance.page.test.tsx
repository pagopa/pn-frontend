import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { acceptTosPrivacyConsentBodyMock } from '../../__mocks__/Consents.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import ToSAcceptance from '../ToSAcceptance.page';

const mockNavigateFn = vi.fn();
const mockOpenFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const tosConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: false,
  consentVersion: 'mocked-version-1',
};

const privacyConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: false,
  consentVersion: 'mocked-version-1',
};

describe('test Terms of Service page', async () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;
  const original = window.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('checks the texts in the page - First ToS acceptance', async () => {
    await act(async () => {
      result = render(<ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />);
    });

    expect(result?.container).toHaveTextContent(/tos.title/i);
    expect(result?.container).toHaveTextContent(/tos.switch-label/i);
    expect(result?.container).toHaveTextContent(/tos.button/i);
  });

  it('accept ToS and Privacy', async () => {
    mock.onPut('/bff/v2/tos-privacy', acceptTosPrivacyConsentBodyMock).reply(200);

    await act(async () => {
      result = render(<ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />);
    });
    const button = result?.getByText('tos.button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe('/bff/v2/tos-privacy');
    });
  });

  it('navigate to dashboard if tos and privacy are accepted', async () => {
    await act(async () => {
      result = render(
        <ToSAcceptance
          tosConsent={{ ...tosConsent, accepted: true }}
          privacyConsent={{ ...privacyConsent, accepted: true }}
        />
      );
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DASHBOARD);
  });

  it('navigate to privacy and tos pages', async () => {
    await act(async () => {
      result = render(<ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />);
    });
    const tosLink = result?.getByTestId('tos-link');
    fireEvent.click(tosLink!);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(TOS_LINK_RELATIVE_PATH, '_blank');
    const privacyLink = result?.getByTestId('privacy-link');
    fireEvent.click(privacyLink!);
    expect(mockOpenFn).toHaveBeenCalledTimes(2);
    expect(mockOpenFn).toHaveBeenCalledWith(PRIVACY_LINK_RELATIVE_PATH, '_blank');
  });
});
