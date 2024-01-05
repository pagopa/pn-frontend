import MockAdapter from 'axios-mock-adapter';
import React, { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { SET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../models/consents';
import * as routes from '../../navigation/routes.const';
import ToSAcceptance from '../ToSAcceptance.page';

const mockNavigateFn = vi.fn();

// this is needed because there is a bug when vi.mock is used
// https://github.com/vitest-dev/vitest/issues/3300
// maybe with vitest 1, we can remove the workaround
const apiClients = await import('../../api/apiClients');

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

describe('test Terms of Service page', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
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
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(TOS_LINK_RELATIVE_PATH);
    const privacyLink = result?.getByTestId('privacy-link');
    fireEvent.click(privacyLink!);
    expect(mockNavigateFn).toBeCalledTimes(2);
    expect(mockNavigateFn).toBeCalledWith(PRIVACY_LINK_RELATIVE_PATH);
  });
});
