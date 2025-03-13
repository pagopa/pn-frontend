import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { ConsentType as FeConsentType, TosPrivacyConsent } from '@pagopa-pn/pn-commons';
import { testFormElements, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { publicKeys } from '../../__mocks__/ApiKeys.mock';
import { userResponse } from '../../__mocks__/Auth.mock';
import { fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  BffPublicKeyRequest,
  BffPublicKeyResponse,
  PublicKeyStatus,
} from '../../generated-client/pg-apikeys';
import {
  BffTosPrivacyActionBody,
  BffTosPrivacyActionBodyActionEnum,
  ConsentType,
} from '../../generated-client/tos-privacy';
import * as routes from '../../navigation/routes.const';
import NewPublicKey from '../NewPublicKey.page';

const mockNavigate = vi.fn();
let kidParams: string | undefined = undefined;
let enableMock: boolean = true;

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual<any>('react-router-dom');
  return {
    ...original,
    useNavigate: () => (enableMock ? mockNavigate : original.useNavigate()),
    useParams: () =>
      enableMock
        ? {
            kid: kidParams,
          }
        : original.useParams(),
  };
});

describe('NewPublicKey Page', () => {
  let mock: MockAdapter;

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

  it('render component', async () => {
    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [
      {
        recipientId: userResponse.uid,
        consentType: ConsentType.TosDestB2B,
        accepted: true,
        consentVersion: '2',
        isFirstAccept: false,
      },
    ]);

    const { container, getByTestId } = render(<NewPublicKey />);

    expect(container).toHaveTextContent('new-public-key.title');
    expect(container).toHaveTextContent('new-public-key.subtitle');

    const exitBtn = getByTestId('exitBtn');
    expect(exitBtn).toBeInTheDocument();

    const stepper = getByTestId('stepper');
    expect(stepper).toBeInTheDocument();
    const firstStep = within(stepper).getByTestId('step-0');
    expect(firstStep).toHaveTextContent('new-public-key.steps.insert-data.title');
    const secondStep = within(stepper).getByTestId('step-1');
    expect(secondStep).toHaveTextContent('new-public-key.steps.get-returned-parameters.title');

    // first step
    const insertForm = getByTestId('publicKeyDataInsertForm');
    expect(insertForm).toBeInTheDocument();

    // second step
    const kidInput = container.querySelector(`input[id="kid"]`);
    expect(kidInput).not.toBeInTheDocument();
    const issuerInput = container.querySelector(`input[id="issuer"]`);
    expect(issuerInput).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });
  });

  it('navigate outside if we are rotating a non active key', async () => {
    const blockedPublicKey = publicKeys.items.find((key) => key.status === PublicKeyStatus.Blocked);
    kidParams = blockedPublicKey?.kid;

    render(<NewPublicKey />, {
      preloadedState: { apiKeysState: { publicKeys } },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(0);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(routes.INTEGRAZIONE_API);
  });

  it('navigate outside if tos api returns invalid response', async () => {
    kidParams = undefined;

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, []);

    render(<NewPublicKey />);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(routes.INTEGRAZIONE_API);
  });

  it('generate new public key - tos not accepted', async () => {
    kidParams = undefined;

    const tosResponse: TosPrivacyConsent = {
      recipientId: userResponse.uid,
      consentType: FeConsentType.TOS_DEST_B2B,
      accepted: false,
      consentVersion: '2',
      isFirstAccept: false,
    };

    const tosBody: BffTosPrivacyActionBody = {
      action: BffTosPrivacyActionBodyActionEnum.Accept,
      version: tosResponse.consentVersion,
      type: ConsentType.TosDestB2B,
    };

    const newPublicKeyRequest: BffPublicKeyRequest = {
      name: 'mocked-key-name',
      publicKey: 'mocked-key-value',
    };

    const newPublicKeyResponse: BffPublicKeyResponse = {
      kid: 'mocked-key-kid',
      issuer: 'mocked-key-issuer',
    };

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [tosResponse]);

    mock.onPut(`/bff/v1/pg/tos-privacy`, [tosBody]).reply(200);

    mock.onPost(`/bff/v1/pg/public-keys`, newPublicKeyRequest).reply(200, newPublicKeyResponse);

    const { container, getByTestId } = render(<NewPublicKey />);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    // fill the form
    const insertForm = getByTestId('publicKeyDataInsertForm');
    await testInput(insertForm, 'name', 'mocked-key-name');
    await testInput(insertForm, 'publicKey', 'mocked-key-value');
    // confirm
    const submitButton = await waitFor(() => getByTestId('step-submit'));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe(`/bff/v1/pg/tos-privacy`);
      expect(JSON.parse(mock.history.put[0].data)).toStrictEqual([tosBody]);
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(`/bff/v1/pg/public-keys`);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(newPublicKeyRequest);
    });

    // if creation goes well, the second step is shown
    await waitFor(() => expect(insertForm).not.toBeInTheDocument());
    testFormElements(
      container,
      'kid',
      'new-public-key.steps.get-returned-parameters.kid',
      newPublicKeyResponse.kid
    );
    testFormElements(
      container,
      'issuer',
      'new-public-key.steps.get-returned-parameters.issuer',
      newPublicKeyResponse.issuer
    );
  });

  it('generate new public key - tos not accepted and aceptance in error', async () => {
    kidParams = undefined;

    const tosResponse: TosPrivacyConsent = {
      recipientId: userResponse.uid,
      consentType: FeConsentType.TOS_DEST_B2B,
      accepted: false,
      consentVersion: '2',
      isFirstAccept: false,
    };

    const tosBody: BffTosPrivacyActionBody = {
      action: BffTosPrivacyActionBodyActionEnum.Accept,
      version: tosResponse.consentVersion,
      type: ConsentType.TosDestB2B,
    };

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [tosResponse]);

    mock.onPut(`/bff/v1/pg/tos-privacy`, [tosBody]).reply(500);

    const { getByTestId } = render(<NewPublicKey />);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    // fill the form
    const insertForm = getByTestId('publicKeyDataInsertForm');
    await testInput(insertForm, 'name', 'mocked-key-name');
    await testInput(insertForm, 'publicKey', 'mocked-key-value');
    // confirm
    const submitButton = await waitFor(() => getByTestId('step-submit'));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe(`/bff/v1/pg/tos-privacy`);
      expect(JSON.parse(mock.history.put[0].data)).toStrictEqual([tosBody]);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(routes.INTEGRAZIONE_API);
  });

  it('generate new public key - tos accepted', async () => {
    kidParams = undefined;

    const tosResponse: TosPrivacyConsent = {
      recipientId: userResponse.uid,
      consentType: FeConsentType.TOS_DEST_B2B,
      accepted: true,
      consentVersion: '2',
      isFirstAccept: false,
    };

    const newPublicKeyRequest: BffPublicKeyRequest = {
      name: 'mocked-key-name',
      publicKey: 'mocked-key-value',
    };

    const newPublicKeyResponse: BffPublicKeyResponse = {
      kid: 'mocked-key-kid',
      issuer: 'mocked-key-issuer',
    };

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [tosResponse]);

    mock.onPost(`/bff/v1/pg/public-keys`, newPublicKeyRequest).reply(200, newPublicKeyResponse);

    const { container, getByTestId } = render(<NewPublicKey />);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    // fill the form
    const insertForm = getByTestId('publicKeyDataInsertForm');
    await testInput(insertForm, 'name', 'mocked-key-name');
    await testInput(insertForm, 'publicKey', 'mocked-key-value');
    // confirm
    const submitButton = await waitFor(() => getByTestId('step-submit'));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(0);
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(`/bff/v1/pg/public-keys`);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(newPublicKeyRequest);
    });

    // if creation goes well, the second step is shown
    await waitFor(() => expect(insertForm).not.toBeInTheDocument());
    testFormElements(
      container,
      'kid',
      'new-public-key.steps.get-returned-parameters.kid',
      newPublicKeyResponse.kid
    );
    testFormElements(
      container,
      'issuer',
      'new-public-key.steps.get-returned-parameters.issuer',
      newPublicKeyResponse.issuer
    );
  });

  it('rotate public key - tos accepted', async () => {
    const notRotatedPublicKeys = publicKeys.items.filter(
      (key) => key.status !== PublicKeyStatus.Rotated
    );
    const activePublicKey = notRotatedPublicKeys.find(
      (key) => key.status === PublicKeyStatus.Active
    );
    kidParams = activePublicKey?.kid;

    const tosResponse: TosPrivacyConsent = {
      recipientId: userResponse.uid,
      consentType: FeConsentType.TOS_DEST_B2B,
      accepted: true,
      consentVersion: '2',
      isFirstAccept: false,
    };

    const newPublicKeyRequest: BffPublicKeyRequest = {
      name: 'mocked-key-name',
      publicKey: 'mocked-key-value',
    };

    const newPublicKeyResponse: BffPublicKeyResponse = {
      kid: 'mocked-key-kid',
      issuer: 'mocked-key-issuer',
    };

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [tosResponse]);

    mock
      .onPost(`/bff/v1/pg/public-keys/${activePublicKey?.kid}/rotate`, newPublicKeyRequest)
      .reply(200, newPublicKeyResponse);

    const { container, getByTestId } = render(<NewPublicKey />, {
      preloadedState: {
        apiKeysState: {
          publicKeys: { items: notRotatedPublicKeys, total: notRotatedPublicKeys.length + 1 },
          issuerState: { tosAccepted: false },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    // fill the form
    const insertForm = getByTestId('publicKeyDataInsertForm');
    await testInput(insertForm, 'name', 'mocked-key-name');
    await testInput(insertForm, 'publicKey', 'mocked-key-value');
    // confirm
    const submitButton = await waitFor(() => getByTestId('step-submit'));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(0);
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(
        `/bff/v1/pg/public-keys/${activePublicKey?.kid}/rotate`
      );
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(newPublicKeyRequest);
    });

    // if creation goes well, the second step is shown
    await waitFor(() => expect(insertForm).not.toBeInTheDocument());
    testFormElements(
      container,
      'kid',
      'new-public-key.steps.get-returned-parameters.kid',
      newPublicKeyResponse.kid
    );
    testFormElements(
      container,
      'issuer',
      'new-public-key.steps.get-returned-parameters.issuer',
      newPublicKeyResponse.issuer
    );
  });

  it('click on exit button', async () => {
    // disable the mock on router dom
    enableMock = false;

    // simulate the current URL
    const history = createBrowserHistory();
    history.push(routes.REGISTRA_CHIAVE_PUBBLICA);

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [
      {
        recipientId: userResponse.uid,
        consentType: ConsentType.TosDestB2B,
        accepted: true,
        consentVersion: '2',
        isFirstAccept: false,
      },
    ]);

    const { getByTestId } = render(
      <Routes>
        <Route path={routes.REGISTRA_CHIAVE_PUBBLICA} element={<NewPublicKey />} />
        <Route
          path={routes.INTEGRAZIONE_API}
          element={<div data-testid="mock-api-keys-page">hello</div>}
        />
      </Routes>
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
    });

    const exitBtn = getByTestId('exitBtn');
    expect(exitBtn).toBeInTheDocument();
    fireEvent.click(exitBtn);

    // prompt must be shown
    const promptDialog = await waitFor(() => getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog).getByTestId('confirmExitBtn');
    expect(confirmExitBtn).toBeInTheDocument();
    fireEvent.click(confirmExitBtn);

    // after clicking the "confirm" button in the prompt, the mocked ApiKeys page should be rendered
    await waitFor(() => {
      const mockApiKeysPageAfter = getByTestId('mock-api-keys-page');
      expect(mockApiKeysPageAfter).toBeInTheDocument();
    });
  });
});
