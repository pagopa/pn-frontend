import * as redux from 'react-redux';

import { RecipientType, createMatchMedia } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../__test__/test-utils';
import * as actions from '../../redux/newDelegation/actions';
import { TrackEventType } from '../../utils/events';
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

// mock action
const mockEntitiesActionFn = jest.fn();
const mockCreateActionFn = jest.fn();
// mock tracking
const createTrackEventSpy = jest.spyOn(trackingFunctions, 'trackEventByType');
const mockTrackEventFn = jest.fn();
// mock dispatch
const mockDispatchFn = jest.fn();

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

describe('NuovaDelega page', () => {
  const original = window.matchMedia;

  let createActionSpy;
  // mock action
  let entitiesActionSpy;
  // mock dispatch
  let useDispatchSpy;

  const initialState = (created: boolean) => ({
    preloadedState: {
      newDelegationState: {
        created,
        entities: [],
      },
    },
  });

  beforeAll(() => {
    window.matchMedia = createMatchMedia(800);
  });

  beforeEach(() => {
    createActionSpy = jest.spyOn(actions, 'createDelegation');
    entitiesActionSpy = jest.spyOn(actions, 'getAllEntities');
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    createActionSpy.mockImplementation(mockCreateActionFn);
    entitiesActionSpy.mockImplementation(mockEntitiesActionFn);
    createTrackEventSpy.mockImplementation(mockTrackEventFn);
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
    createActionSpy.mockClear();
    createActionSpy.mockReset();
    entitiesActionSpy.mockClear();
    entitiesActionSpy.mockReset();
    createTrackEventSpy.mockClear();
    createTrackEventSpy.mockReset();
  });

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders the component desktop view', () => {
    const result = render(<NuovaDelega />, initialState(false));

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the component mobile view', () => {
    const result = render(<NuovaDelega />, initialState(false));

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the component after a delegation is created', () => {
    const result = render(<NuovaDelega />, initialState(true));

    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });

  it('navigates to Deleghe page before creation', () => {
    const result = render(<NuovaDelega />, initialState(false));
    const backButton = result.getByTestId('breadcrumb-indietro-button');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('navigates to Deleghe page after creation', () => {
    const result = render(<NuovaDelega />, initialState(true));
    const backButton = result.getByText('nuovaDelega.backToDelegations');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('switch to selected entities radio and call the filling entities function', async () => {
    const result = render(<NuovaDelega />, initialState(false));
    const radio = result.getByTestId('radioSelectedEntities');
    await waitFor(() => fireEvent.click(radio));
    expect(mockEntitiesActionFn).toBeCalledTimes(1);
  });

  it('fills the form and calls the create function', async () => {
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
        selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
        codiceFiscale: 'RSSMRA01A01A111A',
        nome: 'Mario',
        cognome: 'Rossi',
        selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
        expirationDate: new Date('01/01/2122'),
        enti: [],
        verificationCode: 'verification code',
        ragioneSociale: '',
      });
    });
  });
});
