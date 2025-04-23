import { vi } from 'vitest';

import { testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import { newNotification } from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { PaymentModel } from '../../../models/NewNotification';
import DebtPosition from '../DebtPosition';

const recipientsWithoutPayment = newNotification.recipients.map(
  ({ payments, debtPosition, ...recipient }) => recipient
);
const confirmHandlerMk = vi.fn();
const goToLasStepMk = vi.fn();
const previousStepMk = vi.fn();

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('DebtPosition Component', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - empty state (one recipient)', async () => {
    // render component
    const { getByTestId } = render(
      <DebtPosition
        recipients={[recipientsWithoutPayment[0]]}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBox = await waitFor(() => getByTestId('payments-type-choice'));
    expect(paymentChoiceBox).toHaveTextContent('debt-position');
    expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
    await testRadio(paymentChoiceBox, 'paymentModel', [
      'radios.pago-pa',
      'radios.f24',
      'radios.pago-pa-f24',
      'radios.nothing',
    ]);
    const buttonSubmit = getByTestId('step-submit');
    const buttonPrevious = getByTestId('previous-step');
    expect(buttonSubmit).toBeDisabled();
    expect(buttonSubmit).toHaveTextContent('button.continue');
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent('back-to-recipient');
    // check the click on prev button
    fireEvent.click(buttonPrevious);
    expect(previousStepMk).toHaveBeenCalledTimes(1);
  });

  it('renders component - empty state (multi recipients)', async () => {
    // render component
    const { getAllByTestId, getByTestId } = render(
      <DebtPosition
        recipients={recipientsWithoutPayment}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
    expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
    for (const paymentChoiceBox of paymentChoiceBoxes) {
      expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
      expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
      await testRadio(paymentChoiceBox, 'paymentModel', [
        'radios.pago-pa',
        'radios.f24',
        'radios.pago-pa-f24',
        'radios.nothing',
      ]);
    }
    const buttonSubmit = getByTestId('step-submit');
    const buttonPrevious = getByTestId('previous-step');
    expect(buttonSubmit).toBeDisabled();
    expect(buttonSubmit).toHaveTextContent('button.continue');
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent('back-to-recipient');
  });

  it('choose an option (two recipients)', async () => {
    // render component
    const { getAllByTestId, getByTestId } = render(
      <DebtPosition
        recipients={[recipientsWithoutPayment[0], recipientsWithoutPayment[1]]}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: {
              ...newNotification,
              recipients: [recipientsWithoutPayment[0], recipientsWithoutPayment[1]],
            },
          },
        },
      }
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
    expect(paymentChoiceBoxes).toHaveLength(2);
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toBeDisabled();
    // choose an option for the first recipient
    await testRadio(
      paymentChoiceBoxes[0],
      'paymentModel',
      ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
      1,
      true
    );
    // to enable the continue button we need that all the recipients have an option selected
    expect(buttonSubmit).toBeDisabled();
    // choose an option for the second recipient
    await testRadio(
      paymentChoiceBoxes[1],
      'paymentModel',
      ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
      3,
      true
    );
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    // check if redux is updated correctly
    await waitFor(() =>
      expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
        [recipientsWithoutPayment[0], recipientsWithoutPayment[1]].map((recipient, index) => ({
          ...recipient,
          debtPosition: index === 0 ? PaymentModel.F24 : PaymentModel.NOTHING,
          payments: [],
        }))
      )
    );
    expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  });

  it('choose an option (two recipients) - back button', async () => {
    // render component
    const { getAllByTestId, getByTestId } = render(
      <DebtPosition
        recipients={recipientsWithoutPayment}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: {
              ...newNotification,
              recipients: recipientsWithoutPayment,
            },
          },
        },
      }
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
    expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
    const buttonPrevious = getByTestId('previous-step');
    // choose first option for all the recipients
    for (const paymentChoiceBox of paymentChoiceBoxes) {
      expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
      expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
      await testRadio(
        paymentChoiceBox,
        'paymentModel',
        ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
        0,
        true
      );
    }
    fireEvent.click(buttonPrevious);
    // check if redux is updated correctly
    await waitFor(() =>
      expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
        recipientsWithoutPayment.map((recipient) => ({
          ...recipient,
          debtPosition: PaymentModel.PAGO_PA,
          payments: [],
        }))
      )
    );
    expect(previousStepMk).toHaveBeenCalledTimes(1);
  });

  it('choose nothing option (multi recipients)', async () => {
    // render component
    const { getAllByTestId, getByTestId } = render(
      <DebtPosition
        recipients={recipientsWithoutPayment}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: {
              ...newNotification,
              recipients: recipientsWithoutPayment,
            },
          },
        },
      }
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
    expect(paymentChoiceBoxes).toHaveLength(recipientsWithoutPayment.length);
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toBeDisabled();
    // choose nothing option for all the recipients
    for (const paymentChoiceBox of paymentChoiceBoxes) {
      expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
      expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
      await testRadio(
        paymentChoiceBox,
        'paymentModel',
        ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'],
        3,
        true
      );
    }
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    // check if redux is updated correctly
    await waitFor(() =>
      expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
        recipientsWithoutPayment.map((recipient) => ({
          ...recipient,
          debtPosition: PaymentModel.NOTHING,
          payments: [],
        }))
      )
    );
    expect(goToLasStepMk).toHaveBeenCalledTimes(1);
  });

  it('initally filled (multi recipients)', async () => {
    // render component
    const { getAllByTestId, getByTestId } = render(
      <DebtPosition
        recipients={newNotification.recipients}
        onConfirm={confirmHandlerMk}
        goToLastStep={goToLasStepMk}
        onPreviousStep={previousStepMk}
      />,
      {
        preloadedState: {
          newNotificationState: {
            notification: newNotification,
          },
        },
      }
    );
    // we wait that the component is correctly rendered
    const paymentChoiceBoxes = await waitFor(() => getAllByTestId('payments-type-choice'));
    expect(paymentChoiceBoxes).toHaveLength(newNotification.recipients.length);
    const buttonSubmit = getByTestId('step-submit');
    expect(buttonSubmit).toBeEnabled();
    // check that radio buttons are correctly filled
    const radioOptions = ['radios.pago-pa', 'radios.f24', 'radios.pago-pa-f24', 'radios.nothing'];
    let recipientIdx = 0;
    for (const paymentChoiceBox of paymentChoiceBoxes) {
      // get radio value from debtPosition set for the recipient
      const radioSelectedValue = newNotification.recipients[recipientIdx].debtPosition
        ?.toLocaleLowerCase()
        .replace(/_/g, '-');
      const radioSelectedIndex = radioOptions.indexOf(`radios.${radioSelectedValue!}`);
      expect(paymentChoiceBox).toHaveTextContent('debt-position-of');
      expect(paymentChoiceBox).toHaveTextContent('which-type-of-payments');
      await testRadio(paymentChoiceBox, 'paymentModel', radioOptions, radioSelectedIndex);
      recipientIdx++;
    }
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    // check if redux is not updated
    await waitFor(() =>
      expect(testStore.getState().newNotificationState.notification.recipients).toStrictEqual(
        newNotification.recipients
      )
    );
    expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  });
});
