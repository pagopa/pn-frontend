import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  PhysicalCommunicationType,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';
import {
  testFormElements,
  testInput,
  testRadio,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { userResponse } from '../../../__mocks__/Auth.mock';
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
import { NotificationFeePolicy, PaymentModel } from '../../../models/NewNotification';
import { NEW_NOTIFICATION_ACTIONS } from '../../../redux/newNotification/actions';
import PreliminaryInformations from '../PreliminaryInformations';

const mockIsPaymentEnabledGetter = vi.fn();

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components?.map((c) => c)}
    </>
  ),
}));

vi.mock('../../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../../services/configuration.service')),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
      TAXONOMY_SEND_URL: 'https://mock-taxonomy-url',
    }),
  };
});

const populateForm = async (
  form: HTMLFormElement,
  hasPayment: boolean,
  organizationName: string = userResponse.organization.name
) => {
  await testInput(form, 'paProtocolNumber', newNotification.paProtocolNumber);
  await testInput(form, 'subject', newNotification.subject);
  await testInput(form, 'taxonomyCode', newNotification.taxonomyCode);
  await testInput(form, 'senderDenomination', organizationName);
  await testSelect(
    form,
    'group',
    newNotificationGroups.map((g) => ({ label: g.name, value: g.id })),
    1
  );
  await testRadio(
    form,
    'comunicationTypeRadio',
    ['registered-letter-890', 'simple-registered-letter'],
    1,
    true
  );
  if (hasPayment) {
    await testRadio(
      form,
      'paymentMethodRadio',
      ['pagopa-notice', 'pagopa-notice-f24-flatrate', 'pagopa-notice-f24', 'nothing'],
      1,
      true
    );
  }
};

describe('PreliminaryInformations component with payment enabled', async () => {
  let result: RenderResult;
  const confirmHandlerMk = vi.fn();
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(true);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders - no required groups', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                  name: 'Comune di Palermo',
                },
              },
            },
          },
        }
      );
    });
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(form, 'paProtocolNumber', 'protocol-number*');
    testFormElements(form, 'subject', 'subject*');
    testFormElements(form, 'abstract', 'abstract');
    testFormElements(form, 'group', 'group');
    testFormElements(form, 'taxonomyCode', 'taxonomy-id*');
    testFormElements(form, 'senderDenomination', 'sender-name*');
    testRadio(form, 'comunicationTypeRadio', ['registered-letter-890', 'simple-registered-letter']);
    testRadio(form, 'paymentMethodRadio', [
      'pagopa-notice',
      'pagopa-notice-f24-flatrate',
      'pagopa-notice-f24',
      'nothing',
    ]);
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
  });

  it('renders - required groups', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                  name: 'Comune di Palermo',
                  hasGroup: true,
                },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(form, 'group', 'group');
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    await populateForm(form, true);
    expect(button).toBeEnabled();
    fireEvent.click(button);
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
        senderDenomination: newNotification.senderDenomination,
        lang: 'it',
        additionalAbstract: '',
        additionalLang: '',
        additionalSubject: '',
      });
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('fills form with invalid values', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    await populateForm(form, true);
    // set invalid values
    // paProtocolNumber
    await testInput(form, 'paProtocolNumber', '');
    const protocolNumberError = form.querySelector('#paProtocolNumber-helper-text');
    expect(protocolNumberError).toHaveTextContent('required-field');
    await testInput(form, 'paProtocolNumber', ' text-with-spaces ');
    expect(protocolNumberError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form, 'paProtocolNumber', randomString(257));
    expect(protocolNumberError).toHaveTextContent('too-long-field-error');
    // subject
    await testInput(form, 'subject', '');
    const subjectError = form.querySelector('#subject-helper-text');
    expect(subjectError).toHaveTextContent('required-field');
    await testInput(form, 'subject', ' text-with-spaces ');
    expect(subjectError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form, 'subject', randomString(135));
    expect(subjectError).toHaveTextContent('too-long-field-error');
    await testInput(form, 'subject', randomString(9));
    expect(subjectError).toHaveTextContent('too-short-field-error');
    // abstract
    await testInput(form, 'abstract', ' text-with-spaces ');
    const abstractError = form.querySelector('#abstract-helper-text');
    expect(abstractError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form, 'abstract', randomString(1025));
    expect(abstractError).toHaveTextContent('too-long-field-error');
    // taxonomyCode
    await testInput(form, 'taxonomyCode', '');
    const taxonomyCodeError = form.querySelector('#taxonomyCode-helper-text');
    expect(taxonomyCodeError).toHaveTextContent('taxonomy-id required');
    await testInput(form, 'taxonomyCode', randomString(4));
    expect(taxonomyCodeError).toHaveTextContent('taxonomy-id invalid');
    // senderDenomination
    await testInput(form, 'senderDenomination', '');
    const senderDenominationError = form.querySelector('#senderDenomination-helper-text');
    expect(senderDenominationError).toHaveTextContent('sender-denomination required');
    await testInput(
      form,
      'senderDenomination',
      'Comune di Palermo - Commissario Straordinario del Governo ZES Sicilia Occidentale'
    );
    expect(senderDenominationError).toHaveTextContent('too-long-field-error');
    // check submit button state
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
  });

  it('form initially filled', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    testFormElements(
      form,
      'paProtocolNumber',
      'protocol-number*',
      newNotification.paProtocolNumber
    );
    testFormElements(form, 'subject', 'subject*', newNotification.subject);
    testFormElements(form, 'abstract', 'abstract', newNotification.abstract);
    testFormElements(form, 'group', 'group', newNotification.group);
    testFormElements(form, 'taxonomyCode', 'taxonomy-id*', newNotification.taxonomyCode);
    testFormElements(form, 'senderDenomination', 'sender-name*', userResponse.organization.name);
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
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(500);
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
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    const statusApiErrorComponent = result.queryByTestId(
      `api-error-${NEW_NOTIFICATION_ACTIONS.GET_USER_GROUPS}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});

describe('PreliminaryInformations Component with payment disabled', async () => {
  let result: RenderResult;
  const confirmHandlerMk = vi.fn();
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsPaymentEnabledGetter.mockReturnValue(false);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const paymentMethodRadio = within(form).queryAllByTestId('paymentMethodRadio');
    expect(paymentMethodRadio).toHaveLength(0);
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
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
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    await populateForm(form, false);
    expect(button).toBeEnabled();
    fireEvent.click(button);
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
        senderDenomination: newNotification.senderDenomination,
        lang: 'it',
        additionalAbstract: '',
        additionalLang: '',
        additionalSubject: '',
      });
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('set senderDenomination longer than 80 characters', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={{
            ...newNotificationEmpty,
            senderDenomination:
              'Comune di Palermo - Commissario Straordinario del Governo ZES Sicilia Occidentale',
          }}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: {
                  name: 'Comune di Palermo - Commissario Straordinario del Governo ZES Sicilia Occidentale',
                },
              },
            },
          },
        }
      );
    });
    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const senderDenominationError = await waitFor(() =>
      form.querySelector('#senderDenomination-helper-text')
    );
    expect(senderDenominationError).toHaveTextContent('too-long-field-error');
    const button = within(form).getByTestId('step-submit');
    // check submit button state
    expect(button).toBeDisabled();
  });

  it('should render taxonomy link with correct href', async () => {
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={{
            ...newNotificationEmpty,
          }}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              user: {
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });

    expect(result.getByRole('link')).toHaveAttribute('href', 'https://mock-taxonomy-url');
  });

  it('should set default additionalLang of user', async () => {
    await act(async () => {
      result = render(
        <PreliminaryInformations
          notification={{
            ...newNotificationEmpty,
          }}
          onConfirm={confirmHandlerMk}
        />,
        {
          preloadedState: {
            userState: {
              additionalLanguages: ['de'],
              user: {
                organization: { name: 'Comune di Palermo', hasGroup: true },
              },
            },
          },
        }
      );
    });

    const form = result.getByTestId('preliminaryInformationsForm') as HTMLFormElement;

    await testRadio(
      form,
      'notificationLanguageRadio',
      ['Italiano', 'italian-and-other-language'],
      1
    );
    testFormElements(form, 'additionalLang', 'select-other-language*', 'de');
  });
});
