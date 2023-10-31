import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import {
  AppResponseMessage,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';
import {
  testFormElements,
  testInput,
  testRadio,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  newNotification,
  newNotificationEmpty,
  newNotificationGroups,
} from '../../../__mocks__/NewNotification.mock';
import {
  RenderResult,
  act,
  fireEvent,
  randomString,
  render,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { NEW_NOTIFICATION_ACTIONS } from '../../../redux/newNotification/actions';
import PreliminaryInformations from '../PreliminaryInformations';

const mockIsPaymentEnabledGetter = jest.fn();

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));
// prova
jest.mock('../../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

const populateForm = async (form: HTMLFormElement, hasPayment: boolean) => {
  await testInput(form!, 'paProtocolNumber', newNotification.paProtocolNumber);
  await testInput(form!, 'subject', newNotification.subject);
  await testInput(form!, 'taxonomyCode', newNotification.taxonomyCode);
  await testSelect(
    form!,
    'group',
    newNotificationGroups.map((g) => ({ label: g.name, value: g.id })),
    1
  );
  await testRadio(
    form!,
    'comunicationTypeRadio',
    ['registered-letter-890', 'simple-registered-letter'],
    1,
    true
  );
  if (hasPayment) {
    await testRadio(
      form!,
      'paymentMethodRadio',
      ['pagopa-notice', 'pagopa-notice-f24-flatrate', 'pagopa-notice-f24', 'nothing'],
      1,
      true
    );
  }
};

describe('PreliminaryInformations component with payment enabled', () => {
  let result: RenderResult | undefined;
  const confirmHandlerMk = jest.fn();
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(true);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders - no required groups', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotificationEmpty} onConfirm={confirmHandlerMk} />
      );
    });
    expect(result!.container).toHaveTextContent(/title/i);
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(form!, 'paProtocolNumber', 'protocol-number*');
    testFormElements(form!, 'subject', 'subject*');
    testFormElements(form!, 'abstract', 'abstract');
    testFormElements(form!, 'group', 'group');
    testFormElements(form!, 'taxonomyCode', 'taxonomy-id*');
    testRadio(form!, 'comunicationTypeRadio', [
      'registered-letter-890',
      'simple-registered-letter',
    ]);
    testRadio(form!, 'paymentMethodRadio', [
      'pagopa-notice',
      'pagopa-notice-f24-flatrate',
      'pagopa-notice-f24',
      'nothing',
    ]);
    const button = within(form).getByTestId('step-submit');
    expect(button!).toBeDisabled();
  });

  it('renders - required groups', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={newNotificationEmpty}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(form!, 'group', 'group');
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={newNotificationEmpty}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    await populateForm(form, true);
    expect(button).toBeEnabled();
    fireEvent.click(button!);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification).toEqual({
        paProtocolNumber: newNotification.paProtocolNumber,
        abstract: '',
        subject: newNotification.subject,
        taxonomyCode: newNotification.taxonomyCode,
        group: newNotificationGroups[1].id,
        notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
        payment: {},
        documents: [],
        recipients: [],
        physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        paymentMode: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE,
      });
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('fills form with invalid values', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={newNotificationEmpty}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    await populateForm(form, true);
    // set invalid values
    // paProtocolNumber
    await testInput(form!, 'paProtocolNumber', '');
    const potrocolNumberError = form.querySelector('#paProtocolNumber-helper-text');
    expect(potrocolNumberError).toHaveTextContent('required-field');
    await testInput(form!, 'paProtocolNumber', ' text-with-spaces ');
    expect(potrocolNumberError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form!, 'paProtocolNumber', randomString(257));
    expect(potrocolNumberError).toHaveTextContent('too-long-field-error');
    // subject
    await testInput(form!, 'subject', '');
    const subjectError = form.querySelector('#subject-helper-text');
    expect(subjectError).toHaveTextContent('required-field');
    await testInput(form!, 'subject', ' text-with-spaces ');
    expect(subjectError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form!, 'subject', randomString(135));
    expect(subjectError).toHaveTextContent('too-long-field-error');
    await testInput(form!, 'subject', randomString(9));
    expect(subjectError).toHaveTextContent('too-short-field-error');
    // abstract
    await testInput(form!, 'abstract', ' text-with-spaces ');
    const abstractError = form.querySelector('#abstract-helper-text');
    expect(abstractError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form!, 'abstract', randomString(1025));
    expect(abstractError).toHaveTextContent('too-long-field-error');
    // taxonomyCode
    await testInput(form!, 'taxonomyCode', '');
    const taxonomyCodeError = form.querySelector('#taxonomyCode-helper-text');
    expect(taxonomyCodeError).toHaveTextContent('taxonomy-id required');
    await testInput(form!, 'taxonomyCode', randomString(4));
    expect(taxonomyCodeError).toHaveTextContent('taxonomy-id invalid');
    // check submit button state
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
  });

  it('form initially filled', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(
      form!,
      'paProtocolNumber',
      'protocol-number*',
      newNotification.paProtocolNumber
    );
    testFormElements(form!, 'subject', 'subject*', newNotification.subject);
    testFormElements(form!, 'abstract', 'abstract', newNotification.abstract);
    testFormElements(form!, 'group', 'group', newNotification.group);
    testFormElements(form!, 'taxonomyCode', 'taxonomy-id*', newNotification.taxonomyCode);
    const physicalCommunicationType = form.querySelector(
      `input[name="physicalCommunicationType"][value="${newNotification.physicalCommunicationType}"]`
    );
    expect(physicalCommunicationType).toBeChecked();
    const paymentMode = form.querySelector(
      `input[name="paymentMode"][value="${newNotification.paymentMode}"]`
    );
    expect(paymentMode).toBeChecked();
  });

  it('errors on api call', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />
        </>,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const statusApiErrorComponent = result?.queryByTestId(
      `api-error-${NEW_NOTIFICATION_ACTIONS.GET_USER_GROUPS}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});

describe('PreliminaryInformations Component with payment disabled', () => {
  let result: RenderResult | undefined;
  const confirmHandlerMk = jest.fn();
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(false);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={newNotificationEmpty}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    expect(result!.container).toHaveTextContent(/title/i);
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const paymentMethodRadio = within(form!).queryAllByTestId('paymentMethodRadio');
    expect(paymentMethodRadio).toHaveLength(0);
    const button = within(form).getByTestId('step-submit');
    expect(button!).toBeDisabled();
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={newNotificationEmpty}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    await populateForm(form, false);
    expect(button).toBeEnabled();
    fireEvent.click(button!);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification).toEqual({
        paProtocolNumber: newNotification.paProtocolNumber,
        abstract: '',
        subject: newNotification.subject,
        taxonomyCode: newNotification.taxonomyCode,
        group: newNotificationGroups[1].id,
        notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
        payment: {},
        documents: [],
        recipients: [],
        physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        paymentMode: PaymentModel.NOTHING,
      });
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });
});
