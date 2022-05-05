import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { render } from '../../../../__test__/test-utils';
import { PaymentModel } from '../../../../models/newNotification';
import PreliminaryInformations from '../PreliminaryInformations';

function testFormElements(form: HTMLFormElement, elementName: string, label: string) {
  const formElement = form.querySelector(`input[name="${elementName}"]`);
  expect(formElement).toBeInTheDocument();
  const formElementLabel = form.querySelector(`label[for="${elementName}"]`);
  expect(formElementLabel).toBeInTheDocument();
  expect(formElementLabel).toHaveTextContent(label);
}

function testRadioElements(form: HTMLFormElement, dataTestId: string, values: Array<string>) {
  const radioButtons = form?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  expect(radioButtons).toHaveLength(values.length);
  values.forEach((value, index) => {
    expect(radioButtons![index]).toHaveTextContent(value);
  });
}

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
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
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  beforeEach(async () => {
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
    expect(result?.container).toHaveTextContent(/Informazioni preliminari/i);
    const form = result?.container.querySelector('form');
    testFormElements(form!, 'paNotificationId', 'Numero di protocollo *');
    testFormElements(form!, 'subject', 'Oggetto della notifica *');
    testFormElements(form!, 'description', 'Descrizione');
    testFormElements(form!, 'group', 'Gruppo *');
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
    const form = result?.container.querySelector('form');
    await testInput(form!, 'paNotificationId', 'mocked-NotificationId');
    await testInput(form!, 'subject', 'mocked-Subject');
    await testRadio(form!, 'comunicationTypeRadio', 1);
    await testRadio(form!, 'paymentMethodRadio', 1);
    const buttons = form?.querySelectorAll('button');
    expect(buttons![1]).toBeEnabled();
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          paNotificationId: 'mocked-NotificationId',
          subject: 'mocked-Subject',
          description: '',
          group: '',
          physicalCommunicationType: PhysicalCommunicationType.REGISTERED_MAIL_AR,
          paymentModel: PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE
        },
        type: 'setPreliminaryInformations',
      });
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
