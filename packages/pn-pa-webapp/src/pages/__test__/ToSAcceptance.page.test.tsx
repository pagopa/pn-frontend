import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { SET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../models/consents';
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
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, tosConsent.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, privacyConsent.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    await act(async () => {
      result = render(<ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />);
    });
    const button = result?.getByText('tos.button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mock.history.put).toHaveLength(2);
      expect(mock.history.put[0].url).toBe(
        SET_CONSENTS(ConsentType.TOS, tosConsent.consentVersion)
      );
      expect(mock.history.put[1].url).toBe(
        SET_CONSENTS(ConsentType.DATAPRIVACY, privacyConsent.consentVersion)
      );
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
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.DASHBOARD);
  });

  it('navigate to privacy and tos pages', async () => {
    await act(async () => {
      result = render(<ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />);
    });
    const tosLink = result?.getByTestId('tos-link');
    fireEvent.click(tosLink!);
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(TOS_LINK_RELATIVE_PATH, '_blank');
    const privacyLink = result?.getByTestId('privacy-link');
    fireEvent.click(privacyLink!);
    expect(mockOpenFn).toBeCalledTimes(2);
    expect(mockOpenFn).toBeCalledWith(PRIVACY_LINK_RELATIVE_PATH, '_blank');
  });
});
