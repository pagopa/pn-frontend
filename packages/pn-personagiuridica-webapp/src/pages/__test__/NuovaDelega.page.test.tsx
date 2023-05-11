import React from 'react';

import { render, fireEvent, waitFor, mockApi, testAutocomplete } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_ALL_ACTIVATED_PARTIES } from '../../api/external-registries/external-registries-routes';
import { CREATE_DELEGATION } from '../../api/delegations/delegations.routes';
import { mockCreateDelegation } from '../../redux/delegation/__test__/test.utils';
import { createDelegationMapper } from '../../redux/newDelegation/actions';
import * as trackingFunctions from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import NuovaDelega from '../NuovaDelega.page';
import { RecipientType } from '@pagopa-pn/pn-commons';

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
    const result = render(<NuovaDelega />, initialState());
    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    const form = result.container.querySelector('form') as HTMLFormElement;
    const selectPF = form.querySelector('[data-testid="selectPF"]') as Element;
    expect(selectPF).toBeInTheDocument();
    const radio = selectPF.querySelector('[type="radio"]');
    expect(radio).toBeChecked();
    const selectPG = form.querySelector('[data-testid="selectPG"]');
    expect(selectPG).toBeInTheDocument();
    const name = form.querySelector(`input[name="nome"]`);
    expect(name).toBeInTheDocument();
    expect(name).toHaveValue('');
    const surname = form.querySelector(`input[name="cognome"]`);
    expect(surname).toBeInTheDocument();
    expect(surname).toHaveValue('');
    const fiscalCode = form.querySelector(`input[name="codiceFiscale"]`);
    expect(fiscalCode).toBeInTheDocument();
    expect(fiscalCode).toHaveValue('');
    const radioSelectedEntities = form.querySelector(
      '[data-testid="radioSelectedEntities"]'
    ) as Element;
    expect(radioSelectedEntities).toBeInTheDocument();
    const radioEntities = radioSelectedEntities.querySelector('[type="radio"]');
    expect(radioEntities).not.toBeChecked();
    const entiSelect = form.querySelector('[data-testid="enti-select"]');
    expect(entiSelect).not.toBeInTheDocument();
    const expirationDate = form.querySelector('[data-testid="expirationDate"]') as Element;
    expect(expirationDate).toBeInTheDocument();
    const verificationCode = form.querySelector('[data-testid="verificationCode"]');
    expect(verificationCode).toBeInTheDocument();
    const createButton = form.querySelector('[data-testid="createButton"]');
    expect(createButton).toBeInTheDocument();
  });

  it('navigates to Deleghe page before creation', () => {
    const result = render(<NuovaDelega />, initialState());
    const backButton = result.getByTestId('breadcrumb-indietro-button');
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('switch to selected entities radio and call the filling entities function', async () => {
    const mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(), 200, undefined, []);
    const result = render(<NuovaDelega />, initialState());
    const radio = result.getByTestId('radioSelectedEntities');
    fireEvent.click(radio);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('ext-registry/pa/v1/activated-on-pn');
    });
    mock.reset();
    mock.restore();
  });

  it('switch to selected entities radio and filter entities list', async () => {
    const entitiesList = [
      {
        id: 'entity-a',
        name: 'Entity A',
      },
      {
        id: 'entity-b',
        name: 'Entity B',
      },
      {
        id: 'entity-c',
        name: 'Entity C',
      },
    ];
    let mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(), 200, undefined, entitiesList);
    mock = mockApi(
      mock,
      'GET',
      GET_ALL_ACTIVATED_PARTIES({ paNameFilter: 'filter' }),
      200,
      undefined,
      [entitiesList[2]]
    );
    const result = render(<NuovaDelega />, initialState());
    const form = result.container.querySelector('form') as HTMLFormElement;
    const radio = result.getByTestId('radioSelectedEntities');
    fireEvent.click(radio);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('ext-registry/pa/v1/activated-on-pn');
    });
    await testAutocomplete(form, 'enti-select', entitiesList, true);
    await testInput(form, 'enti-select', 'filter');
    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);
      expect(mock.history.get[1].url).toContain(
        'ext-registry/pa/v1/activated-on-pn?paNameFilter=filter'
      );
    });
    await testAutocomplete(form, 'enti-select', [entitiesList[2]], false);
    mock.reset();
    mock.restore();
  });

  it('fills the form and calls the create function - all entities', async () => {
    const formData = {
      selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
      codiceFiscale: 'RSSMRA01A01A111A',
      nome: 'Mario',
      cognome: 'Rossi',
      ragioneSociale: '',
      selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
      expirationDate: new Date('01/01/2122'),
      enti: [],
      verificationCode: 'verification code',
    };
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      createDelegationMapper(formData),
      mockCreateDelegation
    );
    const result = render(<NuovaDelega />, initialState());
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', 'Mario');
    await testInput(form, 'cognome', 'Rossi');
    await testInput(form, 'codiceFiscale', 'RSSMRA01A01A111A');
    await testInput(form, 'expirationDate', '01/01/2122');
    const button = result.queryByTestId('createButton') as Element;
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockTrackEventFn).toBeCalledTimes(1);
      expect(mockTrackEventFn).toBeCalledWith(TrackEventType.DELEGATION_DELEGATE_ADD_ACTION);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandate');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(createDelegationMapper(formData));
    });
    mock.reset();
    mock.restore();
    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });

  it('fills the form and calls the create function - selected entities', async () => {
    const entitiesList = [
      {
        id: 'entity-a',
        name: 'Entity A',
      },
      {
        id: 'entity-b',
        name: 'Entity B',
      },
      {
        id: 'entity-c',
        name: 'Entity C',
      },
    ];
    let mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(), 200, undefined, entitiesList);
    const formData = {
      selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
      codiceFiscale: 'RSSMRA01A01A111A',
      nome: 'Mario',
      cognome: 'Rossi',
      ragioneSociale: '',
      selectTuttiEntiOrSelezionati: 'entiSelezionati',
      expirationDate: new Date('01/01/2122'),
      enti: [
        {
          id: 'entity-a',
          name: 'Entity A',
        },
        {
          id: 'entity-c',
          name: 'Entity C',
        },
      ],
      verificationCode: 'verification code',
    };
    mock = mockApi(
      mock,
      'POST',
      CREATE_DELEGATION(),
      200,
      createDelegationMapper(formData),
      mockCreateDelegation
    );
    const result = render(<NuovaDelega />, initialState());
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', 'Mario');
    await testInput(form, 'cognome', 'Rossi');
    await testInput(form, 'codiceFiscale', 'RSSMRA01A01A111A');
    await testInput(form, 'expirationDate', '01/01/2122');
    const radio = result.getByTestId('radioSelectedEntities');
    fireEvent.click(radio);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('ext-registry/pa/v1/activated-on-pn');
    });
    await testAutocomplete(form, 'enti-select', entitiesList, true, 0, true);
    await testAutocomplete(form, 'enti-select', entitiesList, true, 2, true);
    const button = result.queryByTestId('createButton') as Element;
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockTrackEventFn).toBeCalledTimes(1);
      expect(mockTrackEventFn).toBeCalledWith(TrackEventType.DELEGATION_DELEGATE_ADD_ACTION);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandate');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(createDelegationMapper(formData));
    });
    mock.reset();
    mock.restore();
    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });
});
