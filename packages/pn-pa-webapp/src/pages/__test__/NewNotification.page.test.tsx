import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { userResponse } from '../../__mocks__/Auth.mock';
import { newNotification, newNotificationGroups } from '../../__mocks__/NewNotification.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CREATE_NOTIFICATION, GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import { GroupStatus } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { newNotificationMapper } from '../../utils/notification.utility';
import NewNotification from '../NewNotification.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockIsPaymentEnabledGetter = jest.fn();
jest.mock('../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

describe('NewNotification Page without payment', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(false);
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
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
    expect(result?.getByTestId('titleBox')).toHaveTextContent('new-notification.title');
    const stepper = result?.getByTestId('stepper');
    expect(stepper).toBeInTheDocument();
    const preliminaryInformation = result?.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    const recipientForm = result?.queryByTestId('recipientForm');
    expect(recipientForm).not.toBeInTheDocument();
    const attachmentsForm = result?.queryByTestId('attachmentsForm');
    expect(attachmentsForm).not.toBeInTheDocument();
    const finalStep = result?.queryByTestId('finalStep');
    expect(finalStep).not.toBeInTheDocument();
    const alert = result?.queryByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  it('clicks on the breadcrumb button', async () => {
    // render component
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/new-notification.breadcrumb-root/i);
    expect(links![0]).toHaveAttribute('href', routes.DASHBOARD);
    fireEvent.click(links![0]);
    // prompt must be shown
    const promptDialog = await waitFor(() => result?.getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog!).getByTestId('confirmExitBtn');
    fireEvent.click(confirmExitBtn);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(routes.DASHBOARD);
    });
  });

  it('clicks on api keys button', async () => {
    // render component
    await act(async () => {
      result = render(<NewNotification />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    const links = result?.getAllByRole('link');
    expect(links![1]).toHaveTextContent(/menu.api-key/i);
    expect(links![1]).toHaveAttribute('href', routes.API_KEYS);
    fireEvent.click(links![1]);
    // prompt must be shown
    const promptDialog = await waitFor(() => result?.getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog!).getByTestId('confirmExitBtn');
    fireEvent.click(confirmExitBtn);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(routes.API_KEYS);
    });
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
    const stepper = result?.getByTestId('stepper');
    const step1 = within(stepper!).getByTestId('step-0');
    const step2 = within(stepper!).getByTestId('step-1');
    // STEP 1
    let buttonSubmit = await waitFor(() => result?.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    let preliminaryInformation = result?.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit!);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result?.getByTestId('step-submit');
    let recipientForm = result?.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit!);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result?.getByTestId('step-submit');
    const attachmentsForm = result?.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();
    // return to step 2
    fireEvent.click(step2);
    await waitFor(() => {
      expect(attachmentsForm).not.toBeInTheDocument();
    });
    recipientForm = result?.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    // return to step 1
    fireEvent.click(step1);
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    preliminaryInformation = result?.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
  });

  it('create new notification', async () => {
    const mappedNotification = newNotificationMapper(newNotification);
    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    mock.onPost(CREATE_NOTIFICATION(), mappedNotification).reply(200, mockResponse);
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
    let buttonSubmit = await waitFor(() => result?.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    const preliminaryInformation = result?.getByTestId('preliminaryInformationsForm');
    expect(preliminaryInformation).toBeInTheDocument();
    fireEvent.click(buttonSubmit!);
    // STEP 2
    await waitFor(() => {
      expect(preliminaryInformation).not.toBeInTheDocument();
    });
    buttonSubmit = result?.getByTestId('step-submit');
    const recipientForm = result?.getByTestId('recipientForm');
    expect(recipientForm).toBeInTheDocument();
    fireEvent.click(buttonSubmit!);
    // STEP 3
    await waitFor(() => {
      expect(recipientForm).not.toBeInTheDocument();
    });
    buttonSubmit = result?.getByTestId('step-submit');
    const attachmentsForm = result?.getByTestId('attachmentsForm');
    expect(attachmentsForm).toBeInTheDocument();
    // FINAL
    fireEvent.click(buttonSubmit!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    const finalStep = result?.getByTestId('finalStep');
    expect(finalStep).toBeInTheDocument();
  });
});

// TODO: to be enriched when payment is enabled again
describe.skip('NewNotification Page with payment', () => {});
