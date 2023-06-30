import * as redux from 'react-redux';
import { fireEvent, waitFor } from '@testing-library/react';
import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/useIsMobile';
import { RecipientType } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import NuovaDelega from '../NuovaDelega.page';
import * as actions from '../../redux/newDelegation/actions';
import * as trackingFunctions from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';

jest.mock('../../component/Deleghe/VerificationCodeComponent', () => ({
  __esModule: true,
  default: () => <div>verification code</div>,
}));

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

const useIsMobileSpy = jest.spyOn(isMobileHook, 'useIsMobile');
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
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
    createActionSpy.mockClear();
    createActionSpy.mockReset();
    entitiesActionSpy.mockClear();
    entitiesActionSpy.mockReset();
    createTrackEventSpy.mockClear();
    createTrackEventSpy.mockReset();
  });

  it('renders the component desktop view', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(false));

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the component mobile view', () => {
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<NuovaDelega />, initialState(false));

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
  });

  it('renders the component after a delegation is created', () => {
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<NuovaDelega />, initialState(true));

    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });

  it('navigates to Deleghe page before creation', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(false));
    const backButton = result.getByTestId('breadcrumb-indietro-button');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('navigates to Deleghe page after creation', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />, initialState(true));
    const backButton = result.getByText('nuovaDelega.backToDelegations');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

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
