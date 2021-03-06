import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { render, testFormElements, testInput, testSelect } from '../../../../__test__/test-utils';
import { PaymentModel } from '../../../../models/NewNotification';
import * as hooks from '../../../../redux/hooks';
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

describe('PreliminaryInformations Component', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  beforeEach(async () => {
    // mock app selector
    const useAppSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
    useAppSelectorSpy.mockReturnValue(['Group1', 'Group2']);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    await act(async () => {
      result = render(
        <PreliminaryInformations notification={newNotification} onConfirm={confirmHandlerMk} />
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders PreliminaryInformations', () => {
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.container.querySelector('form');
    testFormElements(form!, 'paProtocolNumber', 'protocol-number*');
    testFormElements(form!, 'subject', 'subject*');
    testFormElements(form!, 'abstract', 'abstract');
    testFormElements(form!, 'group', 'group*');
    testRadioElements(form!, 'comunicationTypeRadio', ['registered-letter-890', 'simple-registered-letter']);
    testRadioElements(form!, 'paymentMethodRadio', [
      'pagopa-notice',
      'pagopa-notice-f24-flatrate',
      'pagopa-notice-f24',
    ]);
    const buttons = form?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![1]).toBeDisabled();
  });

  it('changes form values and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
    await testInput(form!, 'paProtocolNumber', 'mocked-NotificationId');
    await testInput(form!, 'subject', 'mocked-Subject');
    await testSelect(form!, 'group', [{label: 'Group1', value: 'Group1'}, {label: 'Group2', value: 'Group2'}], 1);
    await testRadio(form!, 'comunicationTypeRadio', 1);
    await testRadio(form!, 'paymentMethodRadio', 1);
    const buttons = form?.querySelectorAll('button');
    expect(buttons![1]).toBeEnabled();
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          paProtocolNumber: 'mocked-NotificationId',
          subject: 'mocked-Subject',
          abstract: '',
          group: 'Group2',
          physicalCommunicationType: PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER,
          paymentMode: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE
        },
        type: 'setPreliminaryInformations',
      });
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
