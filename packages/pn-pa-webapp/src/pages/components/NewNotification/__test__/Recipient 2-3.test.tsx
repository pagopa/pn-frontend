import React from 'react';

import { RecipientType } from '@pagopa-pn/pn-commons';

import { newNotification } from '../../../../__mocks__/NewNotification.mock';
import {
  RenderResult,
  act,
  fireEvent,
  randomString,
  render,
  testFormElements,
  testInput,
  testRadio,
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

const testRecipientFormRendering = async (
  form: HTMLElement,
  recipientIndex: number,
  hasPayment: boolean,
  recipient?: NewNotificationRecipient
) => {
  await testRadio(
    form,
    `recipientType${recipientIndex}`,
    ['physical-person', 'legal-person'],
    recipient ? recipientIndex : undefined
  );
  await testFormElements(
    form,
    `recipients[${recipientIndex}].firstName`,
    'name*',
    recipient ? recipient.firstName : undefined
  );
  if (!recipient || (recipient && recipient.recipientType === RecipientType.PF)) {
    await testFormElements(
      form,
      `recipients[${recipientIndex}].lastName`,
      'surname*',
      recipient ? recipient.lastName : undefined
    );
  }
  await testFormElements(
    form,
    `recipients[${recipientIndex}].taxId`,
    recipient && recipient.recipientType === RecipientType.PG
      ? 'recipient-organization-tax-id*'
      : 'recipient-citizen-tax-id*',
    recipient ? recipient.taxId : undefined
  );
  if (hasPayment) {
    await testFormElements(
      form,
      `recipients[${recipientIndex}].creditorTaxId`,
      'creditor-fiscal-code*',
      recipient ? recipient.creditorTaxId : undefined
    );
    await testFormElements(
      form,
      `recipients[${recipientIndex}].noticeCode`,
      'notice-code*',
      recipient ? recipient.noticeCode : undefined
    );
  }
  const showDigitalDomicile = within(form).getByTestId(
    `recipients[${recipientIndex}].digitalDomicileCheckbox`
  );
  expect(showDigitalDomicile).toHaveTextContent('add-digital-domicile');
  const showPhysicalAddress = within(form).getByTestId(
    `recipients[${recipientIndex}].physicalAddressCheckbox`
  );
  expect(showPhysicalAddress).toHaveTextContent('add-physical-domicile*');
  // check that recipientType is initially selected
  const recipientType = form.querySelector(
    `input[name="recipients[${recipientIndex}].recipientType"][value="${
      recipient ? recipient.recipientType : RecipientType.PF
    }"]`
  );
  expect(recipientType).toBeChecked();
  // check that digital and physical address forms are (not) displayed
  const digitalForm = form.querySelector(
    `input[name="recipients[${recipientIndex}].digitalDomicile"]`
  );
  const physicalForm = within(form).queryByTestId(`physicalAddressForm${recipientIndex}`);
  if (recipient?.showPhysicalAddress) {
    expect(physicalForm).toBeInTheDocument();
    const address = physicalForm?.querySelector(
      `input[name="recipients[${recipientIndex}].address"]`
    );
    expect(address).toHaveValue(recipient.address);
    const houseNumber = physicalForm?.querySelector(
      `input[name="recipients[${recipientIndex}].houseNumber"]`
    );
    expect(houseNumber).toHaveValue(recipient.houseNumber);
    const municipality = physicalForm?.querySelector(
      `input[name="recipients[${recipientIndex}].municipality"]`
    );
    expect(municipality).toHaveValue(recipient.municipality);
    const zip = physicalForm?.querySelector(`input[name="recipients[${recipientIndex}].zip"]`);
    expect(zip).toHaveValue(recipient.zip);
    const province = physicalForm?.querySelector(
      `input[name="recipients[${recipientIndex}].province"]`
    );
    expect(province).toHaveValue(recipient.province);
    const foreignState = physicalForm?.querySelector(
      `input[name="recipients[${recipientIndex}].foreignState"]`
    );
    expect(foreignState).toHaveValue(recipient.foreignState);
  } else {
    expect(physicalForm).not.toBeInTheDocument();
  }
  if (recipient?.showDigitalDomicile) {
    expect(digitalForm).toBeInTheDocument();
    expect(digitalForm).toHaveValue(recipient.digitalDomicile);
  } else {
    expect(digitalForm).not.toBeInTheDocument();
  }
};

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

describe('Recipient Component with payment enabled - 2/3', () => {
  const confirmHandlerMk = jest.fn();
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
    jest.clearAllMocks();
  });

  it('fills form with invalid values - two recipients', async () => {
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
    // add new recipient
    const addButton = within(form).getByTestId('add-recipient');
    fireEvent.click(addButton);
    // fill the second recipient
    await populateForm(form, 1, true, newNotification.recipients[1]);
    expect(submitButton).toBeEnabled();
    // set invalid values
    // compared to PF case, only firstName and taxId validations change
    // firstName
    const firstNameError = await testStringFieldValidation(form, 1, 'firstName');
    await testInput(form!, 'recipients[1].firstName', 'text-with-invalid-char’');
    expect(firstNameError).toHaveTextContent('forbidden-characters-denomination-error');
    await testInput(form!, 'recipients[1].firstName', randomString(81));
    expect(firstNameError).toHaveTextContent('too-long-field-error');
    // taxId
    await testInput(form, 'recipients[1].taxId', '', true);
    const taxIdError = form.querySelector('[id="recipients[1].taxId-helper-text"]');
    expect(taxIdError).toHaveTextContent('required-field');
    await testInput(form!, 'recipients[1].taxId', 'wrong-fiscal-code');
    expect(taxIdError).toHaveTextContent('fiscal-code-error');
    expect(submitButton).toBeDisabled();
    // identical taxId
    await testInput(form!, 'recipients[0].taxId', newNotification.recipients[0].taxId);
    await testInput(form!, 'recipients[1].taxId', newNotification.recipients[0].taxId);
    expect(taxIdError).toHaveTextContent('identical-fiscal-codes-error');
    // identical creditorTaxId and noticeCode
    await testInput(
      form!,
      'recipients[0].creditorTaxId',
      newNotification.recipients[0].creditorTaxId
    );
    await testInput(
      form!,
      'recipients[1].creditorTaxId',
      newNotification.recipients[0].creditorTaxId
    );
    await testInput(form!, 'recipients[0].noticeCode', newNotification.recipients[0].noticeCode);
    await testInput(form!, 'recipients[1].noticeCode', newNotification.recipients[0].noticeCode);
    const noticeCodeError = form.querySelector('[id="recipients[1].noticeCode-helper-text"]');
    expect(noticeCodeError).toHaveTextContent('identical-notice-codes-error');
    // remove second recipient and check that the form returns valid
    const deleteIcon = result?.queryAllByTestId('DeleteRecipientIcon');
    fireEvent.click(deleteIcon![1]);
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('form initially filled - two recipients', async () => {
    // render component
    await act(async () => {
      result = render(
        <Recipient
          paymentMode={newNotification.paymentMode}
          onConfirm={confirmHandlerMk}
          recipientsData={newNotification.recipients}
        />
      );
    });
    const form = result!.getByTestId('recipientForm') as HTMLFormElement;
    expect(result?.container).toHaveTextContent(/title 1/i);
    expect(result?.container).toHaveTextContent(/title 2/i);
    await testRecipientFormRendering(form, 0, true, newNotification.recipients[0]);
    await testRecipientFormRendering(form, 1, true, newNotification.recipients[1]);
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
  });
});
