import React from 'react';

import { RecipientType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../__mocks__/NewNotification.mock';
import {
  RenderResult,
  act,
  fireEvent,
  randomString,
  render,
  testInput,
  testRadio,
  testStore,
  waitFor,
  within,
} from '../../../../__test__/test-utils';
import { NewNotificationRecipient } from '../../../../models/NewNotification';
import Recipient from '../Recipient';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const populateForm = async (
  form: HTMLFormElement,
  recipientIndex: number,
  hasPayment: boolean,
  recipient: NewNotificationRecipient
) => {
  // if pg select the right radio button
  if (recipient.recipientType === RecipientType.PG) {
    await testRadio(form, `recipientType${recipientIndex}`, ['physical-person', 'legal-person'], 1);
  }
  await testInput(form, `recipients[${recipientIndex}].firstName`, recipient.firstName);
  if (recipient.recipientType === RecipientType.PF) {
    await testInput(form, `recipients[${recipientIndex}].lastName`, recipient.lastName);
  }
  await testInput(form, `recipients[${recipientIndex}].taxId`, recipient.taxId);
  if (hasPayment) {
    await testInput(form, `recipients[${recipientIndex}].creditorTaxId`, recipient.creditorTaxId);
    await testInput(form, `recipients[${recipientIndex}].noticeCode`, recipient.noticeCode);
  }
  // show physical address form
  if (recipient.showPhysicalAddress) {
    const checkbox = within(form).getByTestId(`showPhysicalAddress${recipientIndex}`);
    fireEvent.click(checkbox!);
    await testInput(form, `recipients[${recipientIndex}].address`, recipient.address);
    await testInput(form, `recipients[${recipientIndex}].houseNumber`, recipient.houseNumber);
    await testInput(form, `recipients[${recipientIndex}].municipality`, recipient.municipality);
    await testInput(form, `recipients[${recipientIndex}].zip`, recipient.zip);
    await testInput(form, `recipients[${recipientIndex}].province`, recipient.province);
    await testInput(form, `recipients[${recipientIndex}].foreignState`, recipient.foreignState);
  }
  // show digital address form
  if (recipient.showDigitalDomicile) {
    const checkbox = within(form).getByTestId(`showDigitalDomicile${recipientIndex}`);
    fireEvent.click(checkbox!);
    await testInput(
      form,
      `recipients[${recipientIndex}].digitalDomicile`,
      recipient.digitalDomicile
    );
  }
};

const testStringFieldValidation = async (
  form: HTMLElement,
  recipientIndex: number,
  fieldName: string,
  maxLength?: number
): Promise<Element> => {
  await testInput(form, `recipients[${recipientIndex}].${fieldName}`, '', true);
  const error = form.querySelector(`[id="recipients[${recipientIndex}].${fieldName}-helper-text"]`);
  expect(error).toHaveTextContent('required-field');
  await testInput(form!, `recipients[${recipientIndex}].${fieldName}`, ' text-with-spaces ');
  expect(error).toHaveTextContent('no-spaces-at-edges');
  if (maxLength) {
    await testInput(form!, `recipients[${recipientIndex}].${fieldName}`, randomString(maxLength));
    expect(error).toHaveTextContent('too-long-field-error');
  }
  return error!;
};

describe('Recipient Component with payment enabled - 1/3', () => {
  const confirmHandlerMk = jest.fn();
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
    jest.clearAllMocks();
  });

  it('changes form values and clicks on confirm - one recipient', async () => {
    // render component
    await act(async () => {
      result = render(
        <Recipient paymentMode={newNotification.paymentMode} onConfirm={confirmHandlerMk} />
      );
    });
    const form = result!.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, true, newNotification.recipients[0]);
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
    // add new recipient
    const addButton = within(form).getByTestId('add-recipient');
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(result?.container).toHaveTextContent(/title 1/i);
      expect(result?.container).toHaveTextContent(/title 2/i);
      expect(submitButton).toBeDisabled();
    });
    const deleteIcon = result?.queryAllByTestId('DeleteRecipientIcon');
    expect(deleteIcon).toHaveLength(2);
    // remove the second recipient
    fireEvent.click(deleteIcon![1]);
    await waitFor(() => {
      expect(result?.container).not.toHaveTextContent(/title 2/i);
    });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        newNotification.recipients[0],
      ]);
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('changes form values and clicks on back - one recipient', async () => {
    const previousHandlerMk = jest.fn();
    // render component
    await act(async () => {
      result = render(
        <Recipient
          paymentMode={newNotification.paymentMode}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousHandlerMk}
        />
      );
    });
    const form = result!.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, true, newNotification.recipients[0]);
    const backButton = within(form).getByTestId('previous-step');
    fireEvent.click(backButton!);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        newNotification.recipients[0],
      ]);
    });
    expect(previousHandlerMk).toBeCalledTimes(1);
  });

  it('fills form with invalid values - one recipient', async () => {
    // render component
    await act(async () => {
      result = render(
        <Recipient paymentMode={newNotification.paymentMode} onConfirm={confirmHandlerMk} />
      );
    });
    const form = result!.getByTestId('recipientForm') as HTMLFormElement;
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeDisabled();
    await populateForm(form, 0, true, newNotification.recipients[0]);
    expect(submitButton).toBeEnabled();
    // set invalid values
    // firstName
    const firstNameError = await testStringFieldValidation(form, 0, 'firstName');
    await testInput(form!, 'recipients[0].firstName', 'text-with-invalid-char’');
    expect(firstNameError).toHaveTextContent('forbidden-characters-denomination-error');
    // lastName
    const lastNameError = await testStringFieldValidation(form, 0, 'lastName');
    await testInput(form!, 'recipients[0].lastName', 'text-with-invalid-char’');
    expect(lastNameError).toBeInTheDocument();
    // firstName + lastName
    await testInput(form!, 'recipients[0].firstName', randomString(40));
    await testInput(form!, 'recipients[0].lastName', randomString(45));
    expect(firstNameError).toHaveTextContent('too-long-field-error');
    expect(lastNameError).toBeInTheDocument();
    // taxId
    await testInput(form, 'recipients[0].taxId', '', true);
    const taxIdError = form.querySelector('[id="recipients[0].taxId-helper-text"]');
    expect(taxIdError).toHaveTextContent('required-field');
    await testInput(form!, 'recipients[0].taxId', 'wrong-fiscal-code');
    expect(taxIdError).toHaveTextContent('fiscal-code-error');
    // digitalDomicile
    const digitalDomicileError = await testStringFieldValidation(form, 0, 'digitalDomicile', 321);
    await testInput(form!, 'recipients[0].digitalDomicile', 'wrong-email-format');
    expect(digitalDomicileError).toHaveTextContent('pec-error');
    // address
    await testStringFieldValidation(form, 0, 'address', 1025);
    // houseNumber
    await testInput(form, 'recipients[0].houseNumber', '', true);
    const houseNumberError = form.querySelector('[id="recipients[0].houseNumber-helper-text"]');
    expect(houseNumberError).toHaveTextContent('required-field');
    // zip
    await testStringFieldValidation(form, 0, 'zip', 13);
    // municipalityDetails
    await testInput(form, 'recipients[0].municipalityDetails', ' text-with-spaces ', true);
    const municipalityDetailsError = form.querySelector(
      '[id="recipients[0].municipalityDetails-helper-text"]'
    );
    expect(municipalityDetailsError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form!, 'recipients[0].municipalityDetails', randomString(257));
    expect(municipalityDetailsError).toHaveTextContent('too-long-field-error');
    // municipality
    await testStringFieldValidation(form, 0, 'zip', 257);
    // province
    await testStringFieldValidation(form, 0, 'province', 257);
    // foreignState
    await testStringFieldValidation(form, 0, 'foreignState');
    // creditorTaxId
    await testInput(form, 'recipients[0].creditorTaxId', '', true);
    const creditorTaxIdError = form.querySelector('[id="recipients[0].creditorTaxId-helper-text"]');
    expect(creditorTaxIdError).toHaveTextContent('required-field');
    await testInput(form!, 'recipients[0].creditorTaxId', 'wrong-fiscal-code');
    expect(creditorTaxIdError).toHaveTextContent('fiscal-code-error');
    // noticeCode
    await testInput(form, 'recipients[0].noticeCode', '', true);
    const noticeCodeError = form.querySelector('[id="recipients[0].noticeCode-helper-text"]');
    expect(noticeCodeError).toHaveTextContent('required-field');
    await testInput(form!, 'recipients[0].noticeCode', 'wrong-notice-code');
    expect(noticeCodeError).toHaveTextContent('notice-code-error');
    expect(submitButton).toBeDisabled();
  });
});
