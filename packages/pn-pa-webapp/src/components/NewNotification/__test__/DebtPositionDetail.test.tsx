import { vi } from 'vitest';

import { testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  newNotification,
  newNotificationRecipients,
} from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import DebtPositionDetail from '../DebtPositionDetail';

const confirmHandlerMk = vi.fn();
const previousStepMk = vi.fn();

describe('DebtPositionDetail Component', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - one recipient - debtPosition pagopa only', async () => {
    const newNotificationWithPagopaOnly = {
      ...newNotification,
      recipients: [newNotificationRecipients[0]],
    };
    // render component
    const { getByTestId } = render(
      <DebtPositionDetail
        notification={newNotification}
        onConfirm={confirmHandlerMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: {
              ...newNotification,
              recipients: newNotificationWithPagopaOnly,
            },
          },
        },
      }
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
    expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
    expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
    await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
      'radios.flat-rate',
      'radios.delivery-mode',
    ]);
    expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');
    await testRadio(paymentChoiceBox, 'pagoPaIntMode', ['radios.sync', 'radios.async']);
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toHaveTextContent('button.continue');
    const buttonPrevious = getByTestId('previous-step');
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
    // check the click on prev button
    fireEvent.click(buttonPrevious);
    expect(previousStepMk).toHaveBeenCalledTimes(1);

    // TO DO: AGGIUNGERE TEST DEL BOX DEI PAGAMENTI
  });

  it('renders component - one recipient - debtPosition f24 only', async () => {
    const newNotificationWithF24Only = {
      ...newNotification,
      recipients: [newNotificationRecipients[2]],
    };

    // render component
    const { getByTestId } = render(
      <DebtPositionDetail
        notification={newNotificationWithF24Only}
        onConfirm={confirmHandlerMk}
        onPreviousStep={previousStepMk}
      />
    );

    // we wait that the component is correctly rendered
    const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
    expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
    expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
    await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
      'radios.flat-rate',
      'radios.delivery-mode',
    ]);
    expect(paymentChoiceBox).not.toHaveTextContent('pagopa-int-mode.title');
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toHaveTextContent('button.continue');
    const buttonPrevious = getByTestId('previous-step');
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
    // check the click on prev button
    fireEvent.click(buttonPrevious);
    expect(previousStepMk).toHaveBeenCalledTimes(1);

    // TO DO: AGGIUNGERE TEST DEL BOX DEI PAGAMENTI
  });

  it('renders component - one recipient - debtPosition f24 and pagopa', async () => {
    const newNotificationWithF24AndPagopa = {
      ...newNotification,
      recipients: [newNotificationRecipients[1]],
    };
    // render component
    const { getByTestId } = render(
      <DebtPositionDetail
        notification={newNotification}
        onConfirm={confirmHandlerMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: {
              ...newNotification,
              recipients: newNotificationWithF24AndPagopa,
            },
          },
        },
      }
    );

    // we wait that the component is correctly rendered
    const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
    expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
    expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
    await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
      'radios.flat-rate',
      'radios.delivery-mode',
    ]);
    expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toHaveTextContent('button.continue');
    const buttonPrevious = getByTestId('previous-step');
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
    // check the click on prev button
    fireEvent.click(buttonPrevious);
    expect(previousStepMk).toHaveBeenCalledTimes(1);

    // TO DO: AGGIUNGERE TEST DEL BOX DEI PAGAMENTI
  });
  // it('renders component - empty state (multi recipients)', async () => {
  //   // render component
  //   const { getAllByTestId, getByTestId } = render(
  //     <DebtPositionDetail
  //       notification={newNotification}
  //       onConfirm={confirmHandlerMk}
  //       onPreviousStep={previousStepMk}
  //     />
  //   );
  //   // we wait that the component is correctly rendered
  //   const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
  //   expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
  //   for (const paymentChoiceBox of paymentChoiceBoxes) {
  //     expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
  //     expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
  //     await testRadio(paymentChoiceBox, 'paymentModel', [
  //       'radios.pago-pa',
  //       'radios.f24',
  //       'radios.pago-pa-f24',
  //       'radios.nothing',
  //     ]);
  //   }
  //   const buttonSubmit = getByTestId('step-submit');
  //   const buttonPrevious = getByTestId('previous-step');
  //   expect(buttonSubmit).toBeDisabled();
  //   expect(buttonSubmit).toHaveTextContent('button.continue');
  //   expect(buttonPrevious).toBeInTheDocument();
  //   expect(buttonPrevious).toHaveTextContent('back-to-recipient');
  // });

  // it('choose an option (two recipients)', async () => {
  //   // render component
  //   const { getAllByTestId, getByTestId } = render(
  //     <DebtPositionDetail
  //       notification={newNotification}
  //       onConfirm={confirmHandlerMk}
  //       onPreviousStep={previousStepMk}
  //     />,
  //     {
  //       preloadedState: {
  //         newNotificationState: {
  //           notification: {
  //             ...newNotification,
  //             recipients: [recipientsWithoutPayment[0], recipientsWithoutPayment[1]],
  //           },
  //         },
  //       },
  //     }
  //   );
  //   // we wait that the component is correctly rendered
  //   const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
  //   expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
  //   const buttonSubmit = getByTestId('step-submit');
  //   expect(buttonSubmit).toBeDisabled();
  //   // choose an option for the first recipient
  //   await testRadio(
  //     paymentChoiceBoxes[0],
  //     'paymentModel',
  //     ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
  //     1,
  //     true
  //   );
  //   // to enable the continue button we need that all the recipients have an option selected
  //   expect(buttonSubmit).toBeDisabled();
  //   // choose an option for the second recipient
  //   await testRadio(
  //     paymentChoiceBoxes[1],
  //     'paymentModel',
  //     ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
  //     3,
  //     true
  //   );
  //   expect(buttonSubmit).toBeEnabled();
  //   fireEvent.click(buttonSubmit);
  //   // check if redux is updated correctly
  //   await waitFor(() =>
  //     expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
  //       [recipientsWithoutPayment[0], recipientsWithoutPayment[1]].map((recipient, index) => ({
  //         ...recipient,
  //         debtPosition: index === 0 ? PaymentModel.F24 : PaymentModel.NOTHING,
  //         payments: [],
  //       }))
  //     )
  //   );
  //   expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  // });

  // it('choose an option (two recipients) - back button', async () => {
  //   // render component
  //   const { getAllByTestId, getByTestId } = render(
  //     <DebtPositionDetail
  //       notification={newNotification}
  //       onConfirm={confirmHandlerMk}
  //       onPreviousStep={previousStepMk}
  //     />,
  //     {
  //       preloadedState: {
  //         newNotificationState: {
  //           notification: {
  //             ...newNotification,
  //             recipients: recipientsWithoutPayment,
  //           },
  //         },
  //       },
  //     }
  //   );
  //   // we wait that the component is correctly rendered
  //   const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
  //   expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
  //   const buttonPrevious = getByTestId('previous-step');
  //   // choose first option for all the recipients
  //   for (const paymentChoiceBox of paymentChoiceBoxes) {
  //     expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
  //     expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
  //     await testRadio(
  //       paymentChoiceBox,
  //       'paymentModel',
  //       ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
  //       0,
  //       true
  //     );
  //   }
  //   fireEvent.click(buttonPrevious);
  //   // check if redux is updated correctly
  //   await waitFor(() =>
  //     expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
  //       recipientsWithoutPayment.map((recipient) => ({
  //         ...recipient,
  //         debtPosition: PaymentModel.PAGO_PA,
  //         payments: [],
  //       }))
  //     )
  //   );
  //   expect(previousStepMk).toHaveBeenCalledTimes(1);
  // });

  // it('choose nothing option (multi recipients)', async () => {
  //   // render component
  //   const { getAllByTestId, getByTestId } = render(
  //     <DebtPositionDetail
  //       notification={newNotification}
  //       onConfirm={confirmHandlerMk}
  //       onPreviousStep={previousStepMk}
  //     />,
  //     {
  //       preloadedState: {
  //         newNotificationState: {
  //           notification: {
  //             ...newNotification,
  //             recipients: recipientsWithoutPayment,
  //           },
  //         },
  //       },
  //     }
  //   );
  //   // we wait that the component is correctly rendered
  //   const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
  //   expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
  //   const buttonSubmit = getByTestId('step-submit');
  //   expect(buttonSubmit).toBeDisabled();
  //   // choose nothing option for all the recipients
  //   for (const paymentChoiceBox of paymentChoiceBoxes) {
  //     expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
  //     expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
  //     await testRadio(
  //       paymentChoiceBox,
  //       'paymentModel',
  //       ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
  //       3,
  //       true
  //     );
  //   }
  //   expect(buttonSubmit).toBeEnabled();
  //   fireEvent.click(buttonSubmit);
  //   // check if redux is updated correctly
  //   await waitFor(() =>
  //     expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
  //       recipientsWithoutPayment.map((recipient) => ({
  //         ...recipient,
  //         debtPosition: PaymentModel.NOTHING,
  //         payments: [],
  //       }))
  //     )
  //   );
  //   expect(goToLasStepMk).toHaveBeenCalledTimes(1);
  // });

  // it('initally filled (multi recipients)', async () => {
  //   // render component
  //   const { getAllByTestId, getByTestId } = render(
  //     <DebtPositionDetail
  //       notification={newNotification}
  //       onConfirm={confirmHandlerMk}
  //       onPreviousStep={previousStepMk}
  //     />,
  //     {
  //       preloadedState: {
  //         newNotificationState: {
  //           notification: newNotification,
  //         },
  //       },
  //     }
  //   );
  //   // we wait that the component is correctly rendered
  //   const paymentChoiceBoxes = await waitFor(() => getAllByTestId('debtPositionDetailForm'));
  //   expect(paymentChoiceBoxes).toHaveLength(newNotification.recipients.length);
  //   const buttonSubmit = getByTestId('step-submit');
  //   expect(buttonSubmit).toBeEnabled();
  //   // check that radio buttons are correctly filled
  //   const radioOptions = ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'];
  //   let recipientIdx = 0;
  //   for (const paymentChoiceBox of paymentChoiceBoxes) {
  //     // get radio value from debtPosition set for the recipient
  //     const radioSelectedValue = newNotification.recipients[recipientIdx].debtPosition
  //       ?.toLocaleLowerCase()
  //       .replace(/_/g, '-');
  //     const radioSelectedIndex = radioOptions.indexOf(`radios.${radioSelectedValue!}`);
  //     expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
  //     expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
  //     await testRadio(paymentChoiceBox, 'paymentModel', radioOptions, radioSelectedIndex);
  //     recipientIdx++;
  //   }
  //   expect(buttonSubmit).toBeEnabled();
  //   fireEvent.click(buttonSubmit);
  //   // check if redux is not updated
  //   await waitFor(() =>
  //     expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
  //       newNotification.recipients
  //     )
  //   );
  //   expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  // });
});
