import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  Configuration,
  ResponseEventDispatcher,
  errorFactoryManager,
} from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import { newNotification, newNotificationGroups } from '../../__mocks__/NewNotification.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { PaConfiguration } from '../../services/configuration.service';
import { PAAppErrorFactory } from '../../utility/AppError/PAAppErrorFactory';
import { newNotificationMapper } from '../../utility/notification.utility';
import NewNotification from '../NewNotification.page';

const mockIsPaymentEnabledGetter = vi.fn();
vi.mock('../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../services/configuration.service')),
    getConfiguration: () => ({
      ...Configuration.get<PaConfiguration>(),
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

describe('NewNotification Page without payment enabled in configuration', async () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(false);
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders page', async () => {
    // render component
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    expect(result.getByTestId('titleBox')).toHaveTextContent('new-notification.title');
    const stepper = result.getByTestId('stepper');
    expect(stepper).toBeInTheDocument();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    const recipientForm = result.queryByTestId('recipientForm');
    expect(recipientForm).not.toBeInTheDocument();
    const attachmentsForm = result.queryByTestId('attachmentsForm');
    expect(attachmentsForm).not.toBeInTheDocument();
    const finalStep = result.queryByTestId('finalStep');
    expect(finalStep).not.toBeInTheDocument();
    const alert = result.queryByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  it('clicks on the breadcrumb button', async () => {
    // insert one entry into the history, so the initial render will refer
    // to the path /new-notification
    const history = createBrowserHistory();
    history.push(routes.NUOVA_NOTIFICA);

    // render with an ad-hoc router, will render initially NewNotification
    // since it corresponds to the top of the mocked history stack
    await act(async () => {
      result = render(
        <Routes>
          <Route
            path={routes.DASHBOARD}
            element={<div data-testid="mocked-dashboard">hello</div>}
          />
          <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
        </Routes>,
        { preloadedState: { userState: { user: userResponse } } }
      );
    });

    // before clicking link - mocked dashboard not present
    const mockedPageBefore = result.queryByTestId('mocked-dashboard');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate clicking the link
    const links = result.getAllByRole('link');
    expect(links[0]).toHaveTextContent(/new-notification.breadcrumb-root/i);
    expect(links[0]).toHaveAttribute('href', routes.DASHBOARD);
    fireEvent.click(links[0]);

    // prompt must be shown
    const promptDialog = await waitFor(() => result.getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog).getByTestId('confirmExitBtn');
    fireEvent.click(confirmExitBtn);

    // after clicking link - mocked dashboard present
    await waitFor(() => {
      const mockedPageAfter = result.queryByTestId('mocked-dashboard');
      expect(mockedPageAfter).toBeInTheDocument();
    });
  });

  it('clicks on api keys button', async () => {
    // insert one entry into the history, so the initial render will refer
    // to the path /new-notification
    const history = createBrowserHistory();
    history.push(routes.NUOVA_NOTIFICA);

    // render with an ad-hoc router, will render initially NewNotification
    // since it corresponds to the top of the mocked history stack
    await act(async () => {
      result = render(
        <Routes>
          <Route
            path={routes.API_KEYS}
            element={<div data-testid="mocked-api-keys-page">hello</div>}
          />
          <Route path={routes.NUOVA_NOTIFICA} element={<NewNotification />} />
        </Routes>,
        { preloadedState: { userState: { user: userResponse } } }
      );
    });

    // before clicking link - mocked api keys page not present
    const mockedPageBefore = result.queryByTestId('mocked-api-keys-page');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate clicking the link
    const link = result.getByTestId('api-how-it-works');
    expect(link).toHaveTextContent(/new-notification.how-it-works/i);
    expect(link).toHaveAttribute(
      'href',
      Configuration.get<PaConfiguration>().DEVELOPER_API_DOCUMENTATION_LINK
    );
  });

  it('clicks on stepper and navigate', async () => {
    // render component
    // because all the step are already deeply tested, we can set the new notification already populated
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          newNotificationState: { notification: newNotification, groups: [] },
          userState: { user: userResponse },
        },
      });
    });
    const stepper = result.getByTestId('stepper');
    const step1 = within(stepper).getByTestId('step-0');
    const step2 = within(stepper).getByTestId('step-1');
    // STEP 1
    let buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    let preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    let recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    const attachmentsForm = result.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();
    // return to step 2
    fireEvent.click(step2);
    await waitFor(() => {
      expect(attachmentsForm).not.toBeInTheDocument();
    });
    recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    // return to step 1
    fireEvent.click(step1);
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
  });

  it('create new notification', async () => {
    const mappedNotification = newNotificationMapper(newNotification);

    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    mock.onPost('/bff/v1/notifications/sent', mappedNotification).reply(200, mockResponse);
    // render component
    // because all the step are already deeply tested, we can set the new notification already populated
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          newNotificationState: { notification: newNotification, groups: [] },
          userState: { user: userResponse },
        },
      });
    });
    // STEP 1
    let buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const attachmentsForm = result.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();

    // FINAL
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    const finalStep = result.getByTestId('finalStep');
    expect(finalStep).toBeInTheDocument();
  });

  it('notification failed for duplicated protocol number', async () => {
    const mappedNotification = newNotificationMapper(newNotification);
    const mockResponse = {
      type: 'GENERIC_ERROR',
      status: 409,
      errors: [
        {
          code: 'PN_GENERIC_INVALIDPARAMETER_DUPLICATED',
          element: 'Duplicated notification for senderPaId##paProtocolNumber##idempotenceToken',
        },
      ],
    };
    mock.onPost('/bff/v1/notifications/sent', mappedNotification).reply(409, mockResponse);

    await act(async () => {
      const Component = () => {
        errorFactoryManager.factory = new PAAppErrorFactory((path, ns) => `${path}.${ns}`);
        return (
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <AppMessage />
            <NewNotification />
          </>
        );
      };
      result = render(<Component />, {
        preloadedState: {
          newNotificationState: { notification: newNotification, groups: [] },
          userState: { user: userResponse },
        },
      });
    });
    // STEP 1
    let buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const attachmentsForm = result.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();
    // FINAL
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    const finalStep = result.queryByTestId('finalStep');
    expect(finalStep).not.toBeInTheDocument();

    // check if toast is in the document
    const snackBar = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(snackBar).toBeInTheDocument();
    expect(snackBar).toHaveTextContent(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.title.notifiche'
    );
    expect(snackBar).toHaveTextContent(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.message.notifiche'
    );
  });

  it('notification failed for duplicated notice code', async () => {
    const mappedNotification = newNotificationMapper(newNotification);
    const mockResponse = {
      type: 'GENERIC_ERROR',
      status: 409,
      errors: [
        {
          code: 'PN_GENERIC_INVALIDPARAMETER_DUPLICATED',
          element: 'Duplicated notification for creditorTaxId##noticeCode',
        },
      ],
    };
    mock.onPost('/bff/v1/notifications/sent', mappedNotification).reply(409, mockResponse);

    await act(async () => {
      const Component = () => {
        errorFactoryManager.factory = new PAAppErrorFactory((path, ns) => `${path}.${ns}`);
        return (
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <AppMessage />
            <NewNotification />
          </>
        );
      };
      result = render(<Component />, {
        preloadedState: {
          newNotificationState: { notification: newNotification, groups: [] },
          userState: { user: userResponse },
        },
      });
    });
    // STEP 1
    let buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const attachmentsForm = result.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();
    // FINAL
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    const finalStep = result.queryByTestId('finalStep');
    expect(finalStep).not.toBeInTheDocument();

    // check if toast is in the document
    const snackBar = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(snackBar).toBeInTheDocument();
    expect(snackBar).toHaveTextContent(
      'new-notification.errors.invalid_parameter_notice_code_duplicate.title.notifiche'
    );
    expect(snackBar).toHaveTextContent(
      'new-notification.errors.invalid_parameter_notice_code_duplicate.message.notifiche'
    );
  });
});

describe('NewNotification Page with payment enabled in configuration', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(true);
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders page', async () => {
    // render component
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    expect(result.getByTestId('titleBox')).toHaveTextContent('new-notification.title');
    const stepper = result.getByTestId('stepper');
    expect(stepper).toBeInTheDocument();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    const recipientForm = result.queryByTestId('recipientForm');
    expect(recipientForm).not.toBeInTheDocument();
    const debtPositionForm = result.queryByTestId('debtPositionForm');
    expect(debtPositionForm).not.toBeInTheDocument();
    const debtPositionDetailForm = result.queryByTestId('debtPositionDetailForm');
    expect(debtPositionDetailForm).not.toBeInTheDocument();
    const attachmentsForm = result.queryByTestId('attachmentsForm');
    expect(attachmentsForm).not.toBeInTheDocument();
    const finalStep = result.queryByTestId('finalStep');
    expect(finalStep).not.toBeInTheDocument();
    const alert = result.queryByTestId('alert');
    expect(alert).not.toBeInTheDocument();
  });

  it('create new notification', async () => {
    const mappedNotification = newNotificationMapper(newNotification);

    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    mock.onPost('/bff/v1/notifications/sent', mappedNotification).reply(200, mockResponse);
    // render component
    // because all the step are already deeply tested, we can set the new notification already populated
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          newNotificationState: { notification: newNotification, groups: [] },
          userState: { user: userResponse },
        },
      });
    });
    // STEP 1
    let buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    const preliminaryInformation = result.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit);

    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const recipientForm = result.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);

    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const debtPositionForm = result.getByTestId('debtPositionForm');
    expect(debtPositionForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);

    // STEP 4
    await waitFor(() => {
      expect(debtPositionForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const debtPositionDetailForm = result.getByTestId('debtPositionDetailForm');
    expect(debtPositionDetailForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit);

    // STEP 5
    await waitFor(() => {
      expect(debtPositionDetailForm).not.toBeInTheDocument();
    });
    buttonSubmit = result.getByTestId('step-submit');
    const attachmentsForm = result.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();

    // FINAL
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    const finalStep = result.getByTestId('finalStep');
    expect(finalStep).toBeInTheDocument();
  });
});
