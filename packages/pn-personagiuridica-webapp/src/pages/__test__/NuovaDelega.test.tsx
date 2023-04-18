import React from 'react';

import { render, fireEvent, waitFor, mockApi } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_ALL_ACTIVATED_PARTIES } from '../../api/external-registries/external-registries-routes';
import * as trackingFunctions from '../../utils/mixpanel';
import NuovaDelega from '../NuovaDelega.page';

jest.mock('../../utils/delegation.utility', () => ({
  ...jest.requireActual('../../utils/delegation.utility'),
  generateVCode: () => 'verification code',
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockNavigateFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

// mock tracking
const createTrackEventSpy = jest.spyOn(trackingFunctions, 'trackEventByType');
const mockTrackEventFn = jest.fn();

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

describe('NuovaDelega page', () => {
  const initialState = () => ({
    preloadedState: {
      newDelegationState: {
        created: false,
        entities: [],
      },
    },
  });

  beforeEach(() => {
    createTrackEventSpy.mockImplementation(mockTrackEventFn);
  });

  afterEach(() => {
    createTrackEventSpy.mockClear();
    createTrackEventSpy.mockReset();
  });

  it('renders the component', () => {
    // const mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(), 200);
    const result = render(<NuovaDelega />, initialState());
    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    // expect(mock.history.get.length).toBe(1);
    // mock.reset();
    // mock.restore();
  });

  it('navigates to Deleghe page before creation', () => {
    const result = render(<NuovaDelega />, initialState());
    const backButton = result.getByTestId('breadcrumb-indietro-button');
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  /*
  it('renders the component after a delegation is created', () => {
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<NuovaDelega />, initialState(true));

    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });

  it('navigates to Deleghe page after creation', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(true));
    const backButton = result.getByText('nuovaDelega.backToDelegations');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });
  */

  /*
  it('switch to selected entities radio and call the filling entities function', async () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(false));
    const radio = result.getByTestId('radioSelectedEntities');
    await waitFor(() => fireEvent.click(radio));
    expect(mockEntitiesActionFn).toBeCalledTimes(1);
  });

  it('fills the form and calls the create function', async () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(false));
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', 'Mario');
    await testInput(form, 'cognome', 'Rossi');
    await testInput(form, 'codiceFiscale', 'RSSMRA01A01A111A');
    await testInput(form, 'expirationDate', '01/01/2122');
    const button = result.queryByTestId('createButton');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mockTrackEventFn).toBeCalledTimes(1);
      expect(mockTrackEventFn).toBeCalledWith(TrackEventType.DELEGATION_DELEGATE_ADD_ACTION);
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockCreateActionFn).toBeCalledTimes(1);
      expect(mockCreateActionFn).toBeCalledWith({
        selectPersonaFisicaOrPersonaGiuridica: 'pf',
        codiceFiscale: 'RSSMRA01A01A111A',
        nome: 'Mario',
        cognome: 'Rossi',
        selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
        expirationDate: new Date('01/01/2122'),
        enteSelect: { name: '', uniqueIdentifier: '' },
        verificationCode: 'verification code',
      });
    });
  });
  */
});
