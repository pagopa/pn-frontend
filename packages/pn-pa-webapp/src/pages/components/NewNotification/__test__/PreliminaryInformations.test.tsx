/* eslint-disable functional/no-let */
import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { render, testFormElements, testInput, testSelect } from '../../../../__test__/test-utils';
import { PaymentModel } from '../../../../models/NewNotification';
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
    [
      { label: 'Group1', value: '1' },
      { label: 'Group2', value: '2' },
    ],
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
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    mockIsPaymentEnabledGetter.mockReturnValue(true);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />,
        {
          preloadedState: {
            newNotificationState: {
              groups: [
                { id: '1', name: 'Group1', description: '', status: 'ACTIVE' },
                { id: '2', name: 'Group2', description: '', status: 'ACTIVE' },
              ],
            },
          },
        }
      );
    });
    // render component
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders PreliminaryInformations with enabled payment', async () => {
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.container.querySelector('form');
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

    const button = form?.querySelector('button');
    expect(button!).toBeDisabled();
  });

  it('changes form values and clicks on confirm ', async () => {
    const form = result.container.querySelector('form');
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
          paymentMode: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE,
        },
        type: 'newNotificationSlice/setPreliminaryInformations',
      });
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});

describe('PreliminaryInformations Component with payment disabled', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    mockIsPaymentEnabledGetter.mockReturnValue(false);
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />,
        {
          preloadedState: {
            newNotificationState: {
              groups: [
                { id: '1', name: 'Group1', description: '', status: 'ACTIVE' },
                { id: '2', name: 'Group2', description: '', status: 'ACTIVE' },
              ],
            },
          },
        }
      );
    });
    // render component
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders PreliminaryInformations with disabled payment', async () => {
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.container.querySelector('form');
    testFormElements(form!, 'paProtocolNumber', 'protocol-number*');
    testFormElements(form!, 'subject', 'subject*');
    testFormElements(form!, 'abstract', 'abstract');
    testFormElements(form!, 'group', 'group');
    testFormElements(form!, 'taxonomyCode', 'taxonomy-id*');
    testRadioElements(form!, 'comunicationTypeRadio', [
      'registered-letter-890',
      'simple-registered-letter',
    ]);
    const button = form?.querySelector('button');
    expect(button!).toBeDisabled();
  });

  it('tests form validation (subject)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateFormWithoutPayment(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `subject`, 'five5');
    expect(submitButton).toBeDisabled();
    await testInput(form, `subject`, 'TwentyTwentyTwenty20');
    expect(submitButton).toBeEnabled();
    await testInput(form, 
      `subject`, 
      'oneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySixoneHundredAndThirtySix3456'
    );
    expect(submitButton).toBeDisabled();
    await testInput(form, `subject`, 'FifteenFifteenX');
    expect(submitButton).toBeEnabled();
  }, 20000);


  it.skip('changes form values and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
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
