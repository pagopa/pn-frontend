import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { render, testFormElements, testInput, testSelect } from '../../../../__test__/test-utils';
import { PaymentModel } from '../../../../models/NewNotification';
import * as hooks from '../../../../redux/hooks';
import PreliminaryInformations from '../PreliminaryInformations';

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
    useAppSelectorSpy.mockReturnValue([
      { id: '1', name: 'Group1', description: '', status: 'ACTIVE' },
      { id: '2', name: 'Group2', description: '', status: 'ACTIVE' },
    ]);
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
    expect(result.container).toHaveTextContent(/Informazioni preliminari/i);
    const form = result.container.querySelector('form');
    testFormElements(form!, 'paProtocolNumber', 'Numero di protocollo*');
    testFormElements(form!, 'subject', 'Oggetto della notifica*');
    testFormElements(form!, 'abstract', 'Descrizione');
    testFormElements(form!, 'group', 'Gruppo*');
    testRadioElements(form!, 'comunicationTypeRadio', ['Modello 890', 'Raccomandata A/R']);
    testRadioElements(form!, 'paymentMethodRadio', [
      'Avviso pagoPA',
      'Avviso pagoPA e Modello F24 forfettario',
      'Avviso pagoPA e Modello F24',
    ]);
    const buttons = form?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![1]).toBeDisabled();
  });

  it('changes form values and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
    await testInput(form!, 'paProtocolNumber', 'mocked-NotificationId');
    await testInput(form!, 'subject', 'mocked-Subject');
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
          group: '2',
          physicalCommunicationType: PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER,
          paymentMode: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE,
        },
        type: 'setPreliminaryInformations',
      });
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
