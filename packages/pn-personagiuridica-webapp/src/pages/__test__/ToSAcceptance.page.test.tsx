import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { acceptTosPrivacyConsentBodyMock } from '../../__mocks__/Consents.mock';
import { fireEvent, render, waitFor } from '../../__test__/test-utils';
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

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string; components: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components.map((c) => c)}
    </>
  ),
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const tosConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

const privacyConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

describe('test Terms of Service page', async () => {
  let mock: MockAdapter;
  const original = window.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('checks the texts in the page - First ToS acceptance', () => {
    const { container } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );

    expect(container).toHaveTextContent(/tos.title/i);
    expect(container).toHaveTextContent(/tos.body/i);
    expect(container).toHaveTextContent(/tos.switch-label/i);
    expect(container).toHaveTextContent(/tos.button/i);
  });

  it('checks the texts in the page - Not first ToS acceptance', () => {
    const { container } = render(
      <ToSAcceptance
        tosConsent={{ ...tosConsent, isFirstAccept: false }}
        privacyConsent={{ ...privacyConsent, isFirstAccept: false }}
      />
    );

    expect(container).toHaveTextContent(/tos.title/i);
    expect(container).toHaveTextContent(/tos.redo-body/i);
    expect(container).toHaveTextContent(/tos.switch-label/i);
    expect(container).toHaveTextContent(/tos.button/i);
  });

  it('accept ToS and Privacy', async () => {
    mock.onPut('/bff/v2/tos-privacy', acceptTosPrivacyConsentBodyMock()).reply(200);
    const { getByRole } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );
    const switchElement = getByRole('checkbox');
    const acceptButton = getByRole('button');
    expect(acceptButton).toBeDisabled();
    fireEvent.click(switchElement);
    await waitFor(() => expect(acceptButton).toBeEnabled());
    fireEvent.click(acceptButton);
    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe('/bff/v2/tos-privacy');
    });
  });

  it('navigate to dashboard if tos and privacy are accepted', async () => {
    render(
      <ToSAcceptance
        tosConsent={{ ...tosConsent, accepted: true }}
        privacyConsent={{ ...privacyConsent, accepted: true }}
      />
    );
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NOTIFICHE);
  });

  it('navigate to privacy and tos pages', async () => {
    const { getByTestId } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );
    const tosLink = getByTestId('terms-and-conditions');
    fireEvent.click(tosLink!);
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(TOS_LINK_RELATIVE_PATH, '_blank');
    const privacyLink = getByTestId('privacy-link');
    fireEvent.click(privacyLink!);
    expect(mockOpenFn).toBeCalledTimes(2);
    expect(mockOpenFn).toBeCalledWith(PRIVACY_LINK_RELATIVE_PATH, '_blank');
  });
});
