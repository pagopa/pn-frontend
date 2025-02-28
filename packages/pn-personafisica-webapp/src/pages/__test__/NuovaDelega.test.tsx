import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { RecipientType, formatDate } from '@pagopa-pn/pn-commons';
import {
  testAutocomplete,
  testFormElements,
  testInput,
  testRadio,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { createDelegationPayload } from '../../__mocks__/CreateDelegation.mock';
import { parties } from '../../__mocks__/ExternalRegistry.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { createDelegationMapper } from '../../redux/newDelegation/actions';
import NuovaDelega from '../NuovaDelega.page';

// The test in which the "indietro" button in the breadcrumb is clicked
// needs the actual version of navigate; mocking it would be inadequate
// since the uses inside PnBreadrumb wouldn't be affected by the mock
// and therefore the test would fail.
// In that test we instead mock a router and a history, let the actual implementation
// of navigate(-1) to go on, and then check that the mocked page corresponding to the
// url in the mocked history is rendered.
let mustMockNavigate = true;

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const originalImplementation = await vi.importActual<any>('react-router-dom');
  return {
    ...originalImplementation,
    useNavigate: () => (mustMockNavigate ? mockNavigateFn : originalImplementation.useNavigate()),
  };
});

vi.mock('../../utility/delegation.utility', async () => ({
  ...(await vi.importActual<any>('../../utility/delegation.utility')),
  generateVCode: () => '34153',
}));

// Get tomorrow date
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

describe('NuovaDelega page', async () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mustMockNavigate = true;
  });

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders the component desktop view', async () => {
    const { container, getAllByTestId, getByTestId } = render(<NuovaDelega />);
    expect(container).toHaveTextContent(/nuovaDelega.title/i);
    expect(container).toHaveTextContent(/nuovaDelega.subtitle/i);
    expect(mock.history.get).toHaveLength(0);
    // check initial values
    await testRadio(
      container,
      'recipientType',
      ['nuovaDelega.form.naturalPerson', 'nuovaDelega.form.legalPerson'],
      0
    );
    testFormElements(container, 'nome', 'nuovaDelega.form.firstName', '');
    testFormElements(container, 'cognome', 'nuovaDelega.form.lastName', '');
    testFormElements(container, 'codiceFiscale', 'nuovaDelega.form.fiscalCode', '');
    await testRadio(
      container,
      'radioSelectedEntities',
      ['nuovaDelega.form.allEntities', 'nuovaDelega.form.onlySelected'],
      0
    );
    testFormElements(container, 'codiceFiscale', 'nuovaDelega.form.fiscalCode', '');
    testFormElements(
      container,
      'expirationDate',
      'nuovaDelega.form.endDate',
      formatDate(tomorrow.toISOString())
    );
    const codeDigit = getAllByTestId('codeDigit');
    const codes = '34153'.split('');
    codeDigit.forEach((code, index) => {
      expect(code).toHaveTextContent(codes[index]);
    });
    const createButton = getByTestId('createButton');
    expect(createButton).toBeEnabled();
  });

  // Cfr the comment in NuovaDelega.page.tsx, when using PnBreadcrumb,
  // about the inability of vi.mock to affect imports inside files in pn-commons
  // (in other terms, pn-commons seems to be outside the scope of vi.mock)
  //
  // Done analogously in pn-personagiuridica-webapp
  // --------------------------------------
  // Carlos Lombardi, 2023-11-14
  // --------------------------------------
  it('navigates to Deleghe page', async () => {
    mustMockNavigate = false;

    let result: RenderResult | undefined;

    // simulate the current URL
    const history = createBrowserHistory();
    history.push(routes.NUOVA_DELEGA);

    // render with an ad-hoc router, will render initially NuovaDelega
    // since it corresponds to the top of the mocked history stack
    await act(async () => {
      result = render(
        <Routes>
          <Route path={routes.DELEGHE} element={<div data-testid="mocked-page">hello</div>} />
          <Route path={routes.NUOVA_DELEGA} element={<NuovaDelega />} />
        </Routes>
      );
    });

    // before pressing "back" button - mocked page not present
    const mockedPageBefore = result?.queryByTestId('mocked-page');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate press of "back" button
    const backButton = result?.getByTestId('breadcrumb-indietro-button');
    fireEvent.click(backButton!);

    // after pressing "back" button - mocked page present
    await waitFor(() => {
      const mockedPageAfter = result?.queryByTestId('mocked-page');
      expect(mockedPageAfter).toBeInTheDocument();
    });
  });

  it('fills the form and calls the create function', async () => {
    const creationPayload = {
      ...createDelegationPayload,
      expirationDate: new Date('01/01/2122'),
      verificationCode: '34153',
    };
    mock.onPost('/bff/v1/mandate', createDelegationMapper(creationPayload)).reply(200);
    const { container, getByTestId, getByText } = render(<NuovaDelega />);
    const form = container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', createDelegationPayload.nome);
    await testInput(form, 'cognome', createDelegationPayload.cognome);
    await testInput(form, 'codiceFiscale', createDelegationPayload.codiceFiscale);
    await testInput(form, 'expirationDate', '01/01/2122');
    const button = getByTestId('createButton');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/mandate');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(
        createDelegationMapper(creationPayload)
      );
    });
    await waitFor(() => {
      expect(container).toHaveTextContent(/nuovaDelega.createdTitle/i);
      expect(container).toHaveTextContent(/nuovaDelega.createdDescription/i);
    });
    const backButton = getByText('nuovaDelega.backToDelegations');
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.DELEGHE);
  });

  it('fills form with invalid values', async () => {
    const { container, getByTestId } = render(<NuovaDelega />);
    // the form is validate on submit
    await testInput(container, 'expirationDate', '');
    const button = getByTestId('createButton');
    fireEvent.click(button);
    // check errors on required field
    const nameError = container.querySelector('#nome-helper-text');
    expect(nameError).toHaveTextContent('nuovaDelega.validation.name.required');
    const surnameError = container.querySelector('#cognome-helper-text');
    expect(surnameError).toHaveTextContent('nuovaDelega.validation.surname.required');
    const fiscalCodeError = container.querySelector('#codiceFiscale-helper-text');
    expect(fiscalCodeError).toHaveTextContent('nuovaDelega.validation.fiscalCode.required');
    const expirationDateError = container.querySelector('#expirationDate-helper-text');
    expect(expirationDateError).toHaveTextContent('nuovaDelega.validation.expirationDate.required');
    // switch to selected entities and check required error
    await testRadio(
      container,
      'radioSelectedEntities',
      ['nuovaDelega.form.allEntities', 'nuovaDelega.form.onlySelected'],
      1,
      true
    );
    const entiError = container.querySelector('#enti-helper-text');
    expect(entiError).toHaveTextContent('nuovaDelega.validation.entiSelected.required');
    // inser wrong data
    await testInput(container, 'codiceFiscale', 'WRONG-FISCAL-CODE');
    expect(fiscalCodeError).toHaveTextContent('nuovaDelega.validation.fiscalCode.wrong');
    await testInput(container, 'expirationDate', formatDate(yesterday.toISOString()));
    expect(expirationDateError).toHaveTextContent('nuovaDelega.validation.expirationDate.wrong');
    // switch to persona giuridica
    await testRadio(
      container,
      'recipientType',
      ['nuovaDelega.form.naturalPerson', 'nuovaDelega.form.legalPerson'],
      1,
      true
    );
    const name = container.querySelector('input[name="nome"]');
    expect(name).not.toBeInTheDocument();
    expect(nameError).not.toBeInTheDocument();
    const surname = container.querySelector('input[name="cognome"]');
    expect(surname).not.toBeInTheDocument();
    expect(surnameError).not.toBeInTheDocument();
    const businessName = container.querySelector('input[name="ragioneSociale"]');
    expect(businessName).toBeInTheDocument();
    // rerun form submission
    fireEvent.click(button);
    const businessNameError = await waitFor(() =>
      container.querySelector('#ragioneSociale-helper-text')
    );
    expect(businessNameError).toHaveTextContent('nuovaDelega.validation.businessName.required');
  });

  it('add delegation to PG and with entities selected', async () => {
    const creationPayload = {
      ...createDelegationPayload,
      selectPersonaFisicaOrPersonaGiuridica: RecipientType.PG,
      codiceFiscale:'01234567890',
      expirationDate: new Date('01/01/2122'),
      verificationCode: '34153',
      enti: [parties[1]],
      selectTuttiEntiOrSelezionati: 'entiSelezionati',
    };
    mock.onPost('/bff/v1/mandate', createDelegationMapper(creationPayload)).reply(200);
    const { container, getByTestId } = render(<NuovaDelega />);
    // switch to persona giuridica
    await testRadio(
      container,
      'recipientType',
      ['nuovaDelega.form.naturalPerson', 'nuovaDelega.form.legalPerson'],
      1,
      true
    );
    const form = container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'ragioneSociale', creationPayload.ragioneSociale);
    await testInput(form, 'codiceFiscale', creationPayload.codiceFiscale);
    await testInput(form, 'expirationDate', '01/01/2122');
    // switch to selected entities
    await testRadio(
      container,
      'radioSelectedEntities',
      ['nuovaDelega.form.allEntities', 'nuovaDelega.form.onlySelected'],
      1,
      true
    );
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe('/bff/v1/pa-list');
    await testAutocomplete(container, 'enti', parties, true, 1);
    // create delegation
    const button = getByTestId('createButton');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/mandate');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(
        createDelegationMapper(creationPayload)
      );
    });
    await waitFor(() => {
      expect(container).toHaveTextContent(/nuovaDelega.createdTitle/i);
      expect(container).toHaveTextContent(/nuovaDelega.createdDescription/i);
    });
  });
});
