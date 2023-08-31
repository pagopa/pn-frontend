import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { ConsentUser } from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { SET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../models/consents';
import ToSAcceptance from '../ToSAcceptance.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const tosFirstAcceptance: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

const privacyFirstAcceptance: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

const tosNonFirstAcceptance: ConsentUser = {
  accepted: false,
  isFirstAccept: false,
  consentVersion: 'mocked-version-2',
};

const privacyNonFirstAcceptance: ConsentUser = {
  accepted: false,
  isFirstAccept: false,
  consentVersion: 'mocked-version-2',
};

describe('test Terms of Service page', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks the texts in the page - First ToS acceptance', async () => {
    await act(async () => {
      result = render(
        <ToSAcceptance tosConsent={tosFirstAcceptance} privacyConsent={privacyFirstAcceptance} />
      );
    });

    expect(result?.container).toHaveTextContent(/tos.title/i);
    expect(result?.container).toHaveTextContent(/tos.switch-label/i);
    expect(result?.container).toHaveTextContent(/tos.button/i);
  });

  it('checks the texts in the page - ToS has changed', async () => {
    await act(async () => {
      result = render(
        <ToSAcceptance
          tosConsent={tosNonFirstAcceptance}
          privacyConsent={privacyNonFirstAcceptance}
        />
      );
    });

    expect(result?.container).toHaveTextContent(/tos.title/i);
    expect(result?.container).toHaveTextContent(/tos.switch-label/i);
    expect(result?.container).toHaveTextContent(/tos.button/i);
  });

  it('accept ToS and Privacy', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, tosFirstAcceptance.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, privacyFirstAcceptance.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    await act(async () => {
      result = render(
        <ToSAcceptance tosConsent={tosFirstAcceptance} privacyConsent={privacyFirstAcceptance} />
      );
    });
    const button = result?.getByText('tos.button');
    expect(button).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(button!);
    });
    expect(mock.history.put).toHaveLength(2);
    expect(mock.history.put[0].url).toBe(
      SET_CONSENTS(ConsentType.TOS, tosFirstAcceptance.consentVersion)
    );
    expect(mock.history.put[1].url).toBe(
      SET_CONSENTS(ConsentType.DATAPRIVACY, privacyFirstAcceptance.consentVersion)
    );
  });
});
