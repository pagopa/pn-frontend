/* eslint-disable functional/no-let */
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { PhysicalCommunicationType, testSelect } from '@pagopa-pn/pn-commons';
import { RenderResult, act, fireEvent, waitFor, within } from '@testing-library/react';

import {
  newNotificationEmpty,
  newNotificationGroups,
} from '../../../../__mocks__/NewNotification.mock';
import { render, testFormElements, testInput, testStore } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { GET_USER_GROUPS } from '../../../../api/notifications/notifications.routes';
import { PaymentModel } from '../../../../models/NewNotification';
import { GroupStatus } from '../../../../models/user';
import PreliminaryInformations from '../PreliminaryInformations';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

function testRadioElements(form: HTMLFormElement, dataTestId: string, values: Array<string>) {
  const radioButtons = form?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  expect(radioButtons).toHaveLength(values.length);
  values.forEach((value, index) => {
    expect(radioButtons[index]).toHaveTextContent(value);
  });
}

async function testRadio(form: HTMLFormElement, dataTestId: string, index: number) {
  const radioButtons = form?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  fireEvent.click(radioButtons[index]);
  await waitFor(() => {
    const radioInput = radioButtons[index].querySelector('input');
    expect(radioInput!).toBeChecked();
  });
}

const populateFormWithoutPayment = async (form: HTMLFormElement) => {
  await testInput(form!, 'paProtocolNumber', 'mocked-NotificationId');
  await testInput(form!, 'subject', 'mocked-Subject');
  await testInput(form!, 'taxonomyCode', '012345N');
  await testSelect(
    form!,
    'group',
    newNotificationGroups.map((g) => ({ label: g.name, value: g.id })),
    1
  );
  await testRadio(form!, 'comunicationTypeRadio', 1);
};

const mockIsPaymentEnabledGetter = jest.fn();
jest.mock('../../../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

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

  it('renders PreliminaryInformations with enabled payment', async () => {
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
    testRadioElements(form!, 'comunicationTypeRadio', [
      'registered-letter-890',
      'simple-registered-letter',
    ]);
    testRadioElements(form!, 'paymentMethodRadio', [
      'pagopa-notice',
      'pagopa-notice-f24-flatrate',
      'pagopa-notice-f24',
      'nothing',
    ]);

    const button = within(form).getByTestId('step-submit');
    expect(button!).toBeDisabled();
  });

  it('changes form values and clicks on confirm ', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotificationEmpty} onConfirm={confirmHandlerMk} />
      );
    });

    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    await testInput(form!, 'paProtocolNumber', 'mocked-NotificationId');
    await testInput(form!, 'subject', 'mocked-Subject');
    await testInput(form!, 'taxonomyCode', '012345N');
    await testSelect(
      form!,
      'group',
      newNotificationGroups.map((g) => ({ label: g.name, value: g.id })),
      1
    );
    await testRadio(form!, 'comunicationTypeRadio', 1);
    await testRadio(form!, 'paymentMethodRadio', 1);

    expect(button).toBeEnabled();

    await waitFor(() => {
      fireEvent.click(button!);
    });

    expect(testStore.getState().newNotificationState.notification).toEqual({
      paProtocolNumber: 'mocked-NotificationId',
      abstract: '',
      subject: 'mocked-Subject',
      taxonomyCode: '012345N',
      group: 'mock-id-2',
      notificationFeePolicy: 'FLAT_RATE',
      payment: {},
      documents: [],
      recipients: [],
      physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      paymentMode: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE,
    });

    expect(confirmHandlerMk).toBeCalledTimes(1);
  });
});

describe('PreliminaryInformations Component with payment disabled', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
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

  it('renders PreliminaryInformations with disabled payment', async () => {
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
    testRadioElements(form!, 'comunicationTypeRadio', [
      'registered-letter-890',
      'simple-registered-letter',
    ]);
    const button = within(form).getByTestId('step-submit');
    expect(button!).toBeDisabled();
  });

  it('tests form validation (subject)', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotificationEmpty} onConfirm={confirmHandlerMk} />
      );
    });
    const form = result!.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeDisabled();
    await populateFormWithoutPayment(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `subject`, 'five5');
    expect(submitButton).toBeDisabled();
    await testInput(form, `subject`, 'TwentyTwentyTwenty20');
    expect(submitButton).toBeEnabled();
    await testInput(
      form,
      `subject`,
      'oneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySix3456'
    );
    expect(submitButton).toBeDisabled();
    await testInput(form, `subject`, 'FifteenFifteenX');
    expect(submitButton).toBeEnabled();
  }, 20000);

  it.skip('changes form values and clicks on confirm', async () => {
    const form = result!.container.querySelector('form');
    await testInput(form!, 'paProtocolNumber', 'mocked-NotificationId');
    await testInput(form!, 'subject', 'mocked-Subject');
    await testInput(form!, 'taxonomyCode', '012345N');
    await testSelect(
      form!,
      'group',
      [
        { label: 'Group1', value: '1' },
        { label: 'Group2', value: '2' },
      ],
      1
    );
    await testRadio(form!, 'comunicationTypeRadio', 1);
    await testRadio(form!, 'paymentMethodRadio', 1);
    const button = form?.querySelector('button');
    expect(button).toBeEnabled();
    fireEvent.click(button!);
    await waitFor(() => {
      // infatti vengono eseguiti due dispatch, uno all'inizio per getUserGroups, l'altro nel submit per setPreliminaryInformations
      // del dispatch per getUserGroups non so' come recuperare l'informazione relativa,
      // perché essendo un asyncThunk il valore con cui viene chiamato il dispatch è infatti una funzione, di cui non so' come ottenere dettagli
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          paProtocolNumber: 'mocked-NotificationId',
          subject: 'mocked-Subject',
          abstract: '',
          taxonomyCode: '012345N',
          group: '2',
          physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
          paymentMode: PaymentModel.NOTHING,
        },
        type: 'newNotificationSlice/setPreliminaryInformations',
      });
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
