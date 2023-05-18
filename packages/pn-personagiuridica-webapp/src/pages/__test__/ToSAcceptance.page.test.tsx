import { ConsentUser } from '@pagopa-pn/pn-commons';
import React from 'react';
import * as redux from 'react-redux';
import { fireEvent, render } from '../../__test__/test-utils';
import ToSAcceptance from '../ToSAcceptance.page';
import { mockApi } from "../../../../pn-personafisica-webapp/src/__test__/test-utils";
import { apiClient } from "@pagopa-pn/pn-personafisica-webapp/src/api/apiClients";
import { SET_CONSENTS } from "@pagopa-pn/pn-personafisica-webapp/src/api/consents/consents.routes";
import { ConsentActionType, ConsentType } from "@pagopa-pn/pn-personafisica-webapp/src/models/consents";
import { waitFor } from "@testing-library/react";

const mockNavigateFn = jest.fn();
const mockDispatchFn = jest.fn();

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('test Terms of Service page', () => {
  beforeEach(() => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });

  const tosFirstAcceptance: ConsentUser = {
    accepted: false,
    isFirstAccept: true,
    consentVersion: "mocked-version-1"
  }

  const privacyFirstAcceptance: ConsentUser = {
    accepted: false,
    isFirstAccept: true,
    consentVersion: "mocked-version-1"
  }

  const tosNonFirstAcceptance: ConsentUser = {
    accepted: false,
    isFirstAccept: false,
    consentVersion: "mocked-version-2"
  }

  const privacyNonFirstAcceptance: ConsentUser = {
    accepted: false,
    isFirstAccept: false,
    consentVersion: "mocked-version-2"
  }

  it('checks the texts in the page - First ToS acceptance', () => {
    const result = render(<ToSAcceptance tosConsent={tosFirstAcceptance} privacyConsent={privacyFirstAcceptance} />);

    expect(result.container).toHaveTextContent(/tos.title/i);
    expect(result.container).toHaveTextContent(/tos.body/i);
    expect(result.container).toHaveTextContent(/tos.switch-label/i);
    expect(result.container).toHaveTextContent(/tos.button/i);
  });

  it('checks the texts in the page - ToS has changed', () => {
    const result = render(<ToSAcceptance tosConsent={tosNonFirstAcceptance} privacyConsent={privacyNonFirstAcceptance} />);

    expect(result.container).toHaveTextContent(/tos.title/i);
    expect(result.container).toHaveTextContent(/tos.redo-body/i);
    expect(result.container).toHaveTextContent(/tos.switch-label/i);
    expect(result.container).toHaveTextContent(/tos.button/i);
  });

  it('tests the switch and button', async () => {
    const mock = mockApi(
      apiClient,
      'PUT',
      SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'),
      200,
      {
        action: ConsentActionType.ACCEPT,
      }
    );

    mockApi(
      mock,
      'PUT',
      SET_CONSENTS(ConsentType.DATAPRIVACY, 'mocked-version-1'),
      200,
      {
        action: ConsentActionType.ACCEPT,
      }
    );

    const result = render(
      <ToSAcceptance tosConsent={tosFirstAcceptance} privacyConsent={privacyFirstAcceptance} />
    );

    const switchElement = result.getByRole('checkbox');
    const acceptButton = result.getByRole('button');

    expect(acceptButton).toBeDisabled();

    fireEvent.click(switchElement);
    expect(acceptButton).toBeEnabled();

    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'));
    });

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(2);
      expect(mock.history.put[1].url).toBe(
        SET_CONSENTS(ConsentType.DATAPRIVACY, 'mocked-version-1')
      );
    });
  })
});
