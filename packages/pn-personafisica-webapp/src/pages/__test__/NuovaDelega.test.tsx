import * as redux from 'react-redux';
import { fireEvent, waitFor } from '@testing-library/react';
import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/IsMobile';

import { render } from '../../__test__/test-utils';
import NuovaDelega from '../NuovaDelega.page';
import * as hooks from '../../redux/hooks';
import * as actions from '../../redux/newDelegation/actions';

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
const mockSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
// mock action
const entitiesActionSpy = jest.spyOn(actions, 'getAllEntities');
const mockEntitiesActionFn = jest.fn();
const createActionSpy = jest.spyOn(actions, 'createDelegation');
const mockCreateActionFn = jest.fn();
// mock dispatch
const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

describe('NuovaDelega page', () => {
  beforeEach(() => {
    createActionSpy.mockImplementation(mockCreateActionFn);
    entitiesActionSpy.mockImplementation(mockEntitiesActionFn);
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    mockSelectorSpy.mockClear();
    mockSelectorSpy.mockReset();
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
    createActionSpy.mockClear();
    createActionSpy.mockReset();
    entitiesActionSpy.mockClear();
    entitiesActionSpy.mockReset();
  });

  it('renders the component desktop view', () => {
    mockSelectorSpy.mockReturnValueOnce({ created: false });
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />);

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockEntitiesActionFn).toBeCalledTimes(1);
  });

  it('renders the component mobile view', () => {
    mockSelectorSpy.mockReturnValueOnce({ created: false });
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<NuovaDelega />);

    expect(result.container).toHaveTextContent(/nuovaDelega.title/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockEntitiesActionFn).toBeCalledTimes(1);
  });

  it('renders the component after a delegation is created', () => {
    mockSelectorSpy.mockReturnValueOnce({ created: true });
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<NuovaDelega />);

    expect(result.container).toHaveTextContent(/nuovaDelega.createdTitle/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.createdDescription/i);
  });

  it('navigates to Deleghe page before creation', () => {
    mockSelectorSpy.mockReturnValueOnce({ created: false });
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />);
    const backButton = result.getByText('button.indietro');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('navigates to Deleghe page after creation', () => {
    mockSelectorSpy.mockReturnValueOnce({ created: true });
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />);
    const backButton = result.getByText('nuovaDelega.backToDelegations');

    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalled();
  });

  it('fills the form and calls the create function', async () => {
    mockSelectorSpy.mockReturnValue({ created: false });
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<NuovaDelega />);
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', 'Mario');
    await testInput(form, 'cognome', 'Rossi');
    await testInput(form, 'codiceFiscale', 'RSSMRA01A01A111A');
    await testInput(form, 'endDate', '23/02/2022');
    const button = result.queryByTestId('createButton');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockCreateActionFn).toBeCalledTimes(1);
      expect(mockCreateActionFn).toBeCalledWith({
        selectPersonaFisicaOrPersonaGiuridica: 'pf',
        codiceFiscale: 'RSSMRA01A01A111A',
        nome: 'Mario',
        cognome: 'Rossi',
        selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
        expirationDate: new Date('02/23/2022').getTime(),
        enteSelect: { name: '', uniqueIdentifier: '' },
        verificationCode: 'verification code',
      });
    });
  });
});
