import { vi } from 'vitest';

import { RecipientType } from '@pagopa-pn/pn-commons';
import { testFormElements, testInput, testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import { newNotification } from '../../../__mocks__/NewNotification.mock';
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
import { NewNotificationRecipient } from '../../../models/NewNotification';
import Recipient from '../Recipient';

const testRecipientFormRendering = async (
  form: HTMLElement,
  recipientIndex: number,
  recipient?: NewNotificationRecipient
) => {
  let recipientTypeValue = undefined;

  if (recipient) {
    recipientTypeValue = recipient.recipientType === RecipientType.PF ? 0 : 1;
  }

  await testRadio(
    form,
    `recipientType${recipientIndex}`,
    ['physical-person', 'legal-person'],
    recipientTypeValue,
    true
  );
  testFormElements(
    form,
    `recipients[${recipientIndex}].firstName`,
    'name*',
    recipient ? recipient.firstName : undefined
  );
  if (!recipient || (recipient && recipient.recipientType === RecipientType.PF)) {
    testFormElements(
      form,
      `recipients[${recipientIndex}].lastName`,
      'surname*',
      recipient ? recipient.lastName : undefined
    );
  }
  testFormElements(
    form,
    `recipients[${recipientIndex}].taxId`,
    recipient && recipient.recipientType === RecipientType.PG
      ? 'recipient-organization-tax-id*'
      : 'recipient-citizen-tax-id*',
    recipient ? recipient.taxId : undefined
  );

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
  expect(digitalForm).toBeInTheDocument();

  const physicalForm = within(form).queryByTestId(`physicalAddressForm${recipientIndex}`);
  expect(physicalForm).toBeInTheDocument();

  if (recipient) {
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

    expect(digitalForm).toHaveValue(recipient.digitalDomicile);
  }
};

const populateForm = async (
  form: HTMLFormElement,
  recipientIndex: number,
  recipient: NewNotificationRecipient
) => {
  // if pg select the right radio button
  if (recipient.recipientType === RecipientType.PG) {
    await testRadio(
      form,
      `recipientType${recipientIndex}`,
      ['physical-person', 'legal-person'],
      1,
      true
    );
  }
  await testInput(form, `recipients[${recipientIndex}].firstName`, recipient.firstName);
  if (recipient.recipientType === RecipientType.PF) {
    await testInput(form, `recipients[${recipientIndex}].lastName`, recipient.lastName);
  }
  await testInput(form, `recipients[${recipientIndex}].taxId`, recipient.taxId);

  // show physical address form
  await testInput(form, `recipients[${recipientIndex}].address`, recipient.address);
  await testInput(form, `recipients[${recipientIndex}].houseNumber`, recipient.houseNumber);
  await testInput(form, `recipients[${recipientIndex}].municipality`, recipient.municipality);
  await testInput(form, `recipients[${recipientIndex}].zip`, recipient.zip);
  await testInput(form, `recipients[${recipientIndex}].province`, recipient.province);
  await testInput(form, `recipients[${recipientIndex}].foreignState`, recipient.foreignState);

  // show digital address form
  await testInput(form, `recipients[${recipientIndex}].digitalDomicile`, recipient.digitalDomicile);
};

const testStringFieldValidation = async (
  form: HTMLElement,
  recipientIndex: number,
  fieldName: string,
  maxLength?: number,
  required = true
): Promise<Element> => {
  await testInput(form, `recipients[${recipientIndex}].${fieldName}`, '', true);
  const error = form.querySelector(`[id="recipients[${recipientIndex}].${fieldName}-helper-text"]`);
  if (required) {
    expect(error).toHaveTextContent('required-field');
  }
  await testInput(form, `recipients[${recipientIndex}].${fieldName}`, ' text-with-spaces ');
  expect(error).toHaveTextContent('no-spaces-at-edges');
  if (maxLength) {
    await testInput(form, `recipients[${recipientIndex}].${fieldName}`, randomString(maxLength));
    expect(error).toHaveTextContent('too-long-field-error');
  }
  return error!;
};

const recipientsWithoutPayments = newNotification.recipients.map(
  ({ payments, debtPosition, ...recipient }) => recipient
);

describe('Recipient Component with payment enabled', async () => {
  const confirmHandlerMk = vi.fn();
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    expect(result.container).toHaveTextContent(/title/i);
    const form = result.getByTestId('recipientForm');
    await testRecipientFormRendering(form, 0);
    const addButton = within(form).getByTestId('add-recipient');
    expect(addButton).toBeInTheDocument();
    const button = within(form).getByTestId('step-submit');
    expect(button).toBeDisabled();
    const backButton = within(form).getByTestId('previous-step');
    expect(backButton).toBeInTheDocument();
  });

  it('changes form values and clicks on confirm - multi recipients', async () => {
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });

    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    const submitButton = within(form).getByTestId('step-submit');
    let addButton = within(form).getByTestId('add-recipient');

    // STEP 1: Fill the first recipient form
    await populateForm(form, 0, newNotification.recipients[0]);
    expect(submitButton).toBeEnabled();

    // STEP 2: Add and fill second recipient
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    await testRecipientFormRendering(form, 1);
    await populateForm(form, 1, newNotification.recipients[1]);

    // STEP 3: Submit form and verify results
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        recipientsWithoutPayments[0],
        recipientsWithoutPayments[1],
      ]);
    });
    expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  }, 10000);

  it('fills form with invalid values - two recipients', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, newNotification.recipients[0]);
    const submitButton = within(form).getByTestId('step-submit');
    // add new recipient
    const addButton = within(form).getByTestId('add-recipient');
    fireEvent.click(addButton);
    // fill the second recipient
    await populateForm(form, 1, newNotification.recipients[1]);
    expect(submitButton).toBeEnabled();
    // set invalid values
    // compared to PF case, only firstName and taxId validations change
    // firstName
    const firstNameError = await testStringFieldValidation(form, 1, 'firstName');
    await testInput(form, 'recipients[1].firstName', 'text-with-invalid-char’');
    expect(firstNameError).toHaveTextContent('forbidden-characters-denomination-error');
    await testInput(form, 'recipients[1].firstName', randomString(81));
    expect(firstNameError).toHaveTextContent('too-long-field-error');
    // taxId empty
    await testInput(form, 'recipients[1].taxId', '', true);
    const taxIdError = form.querySelector('[id="recipients[1].taxId-helper-text"]');
    expect(taxIdError).toHaveTextContent('required-field');
    // taxId using PF type on PG recipient
    await testInput(form, 'recipients[1].taxId', newNotification.recipients[0].taxId, true);
    expect(taxIdError).toHaveTextContent('fiscal-code-error');
    // taxId error
    await testInput(form, 'recipients[1].taxId', 'wrong-fiscal-code');
    expect(taxIdError).toHaveTextContent('fiscal-code-error');
    expect(submitButton).toBeDisabled();
    // identical taxId
    const radioPhysicalPerson = result.queryAllByLabelText('physical-person')[1];
    fireEvent.click(radioPhysicalPerson);
    await testInput(form, 'recipients[0].taxId', newNotification.recipients[0].taxId, true);
    await testInput(form, 'recipients[1].taxId', newNotification.recipients[0].taxId, true);
    expect(taxIdError).toHaveTextContent('identical-fiscal-codes-error');
    // remove second recipient and check that the form returns valid
    const deleteIcon = result.queryAllByTestId('DeleteRecipientIcon');
    fireEvent.click(deleteIcon[1]);
    await waitFor(() => expect(submitButton).toBeEnabled());
  }, 10000);

  it('form initially filled - multi recipients', async () => {
    // render component
    await act(async () => {
      result = render(
        <Recipient onConfirm={confirmHandlerMk} recipientsData={newNotification.recipients} />
      );
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    await testRecipientFormRendering(form, 0, newNotification.recipients[0]);
    await testRecipientFormRendering(form, 1, newNotification.recipients[1]);
    await testRecipientFormRendering(form, 2, newNotification.recipients[2]);
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
  }, 10000);

  it('changes form values and clicks on confirm - one recipient', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, newNotification.recipients[0]);
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
    // add new recipient
    const addButton = within(form).getByTestId('add-recipient');
    fireEvent.click(addButton);
    await waitFor(() => {
      const forms = within(form).getAllByTestId('RecipientFormBox');
      expect(forms).toHaveLength(2);
      expect(submitButton).toBeDisabled();
    });
    const deleteIcon = result.queryAllByTestId('DeleteRecipientIcon');
    expect(deleteIcon).toHaveLength(2);
    // remove the second recipient
    fireEvent.click(deleteIcon[1]);
    await waitFor(() => {
      const forms = within(form).getAllByTestId('RecipientFormBox');
      expect(forms).toHaveLength(1);
    });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        recipientsWithoutPayments[0],
      ]);
    });
    expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  }, 10000);

  it('changes form values and clicks on back - one recipient', async () => {
    const previousHandlerMk = vi.fn();
    // render component
    await act(async () => {
      result = render(
        <Recipient onConfirm={confirmHandlerMk} onPreviousStep={previousHandlerMk} />
      );
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, newNotification.recipients[0]);
    const backButton = within(form).getByTestId('previous-step');
    fireEvent.click(backButton);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        recipientsWithoutPayments[0],
      ]);
    });
    expect(previousHandlerMk).toHaveBeenCalledTimes(1);
  }, 10000);

  it('fills form with invalid values - one recipient', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeDisabled();
    await populateForm(form, 0, newNotification.recipients[0]);
    expect(submitButton).toBeEnabled();
    // set invalid values
    // firstName
    const firstNameError = await testStringFieldValidation(form, 0, 'firstName');
    await testInput(form, 'recipients[0].firstName', 'text-with-invalid-char’');
    expect(firstNameError).toHaveTextContent('forbidden-characters-denomination-error');
    // lastName
    const lastNameError = await testStringFieldValidation(form, 0, 'lastName');
    await testInput(form, 'recipients[0].lastName', 'text-with-invalid-char’');
    expect(lastNameError).toBeInTheDocument();
    // firstName + lastName
    await testInput(form, 'recipients[0].firstName', randomString(40));
    await testInput(form, 'recipients[0].lastName', randomString(45));
    expect(firstNameError).toHaveTextContent('too-long-field-error');
    expect(lastNameError).toBeInTheDocument();
    // taxId
    await testInput(form, 'recipients[0].taxId', '', true);
    const taxIdError = form.querySelector('[id="recipients[0].taxId-helper-text"]');
    expect(taxIdError).toHaveTextContent('required-field');
    await testInput(form, 'recipients[0].taxId', 'wrong-fiscal-code');
    expect(taxIdError).toHaveTextContent('fiscal-code-error');
    // digitalDomicile
    await testInput(form, 'recipients[0].digitalDomicile', ' text-with-spaces ');
    const digitalDomicileError = form.querySelector(
      `[id="recipients[0].digitalDomicile-helper-text"]`
    );
    expect(digitalDomicileError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form, 'recipients[0].digitalDomicile', 'wrong-email-format');
    expect(digitalDomicileError).toHaveTextContent('pec-error');

    // address
    await testStringFieldValidation(form, 0, 'address', 1025);
    // houseNumber
    await testInput(form, 'recipients[0].houseNumber', '', true);
    const houseNumberError = form.querySelector('[id="recipients[0].houseNumber-helper-text"]');
    expect(houseNumberError).toHaveTextContent('required-field');
    // zip
    await testInput(form, 'recipients[0].zip', '20100&', true);
    const zipError = form.querySelector('[id="recipients[0].zip-helper-text"]');
    expect(zipError).toHaveTextContent('zip invalid');
    // municipalityDetails
    await testInput(form, 'recipients[0].municipalityDetails', ' text-with-spaces ', true);
    const municipalityDetailsError = form.querySelector(
      '[id="recipients[0].municipalityDetails-helper-text"]'
    );
    expect(municipalityDetailsError).toHaveTextContent('no-spaces-at-edges');
    await testInput(form, 'recipients[0].municipalityDetails', randomString(257));
    expect(municipalityDetailsError).toHaveTextContent('too-long-field-error');
    // municipality
    await testStringFieldValidation(form, 0, 'municipality', 257);
    // province
    await testStringFieldValidation(form, 0, 'province', 257);
    // foreignState
    await testStringFieldValidation(form, 0, 'foreignState');
  }, 10000);
});

describe('Recipient Component without payment enabled', async () => {
  const confirmHandlerMk = vi.fn();
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    const form = result.getByTestId('recipientForm');
    await testRecipientFormRendering(form, 0);
  });

  it('changes form values and clicks on confirm - one recipient', async () => {
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={confirmHandlerMk} />);
    });
    const form = result.getByTestId('recipientForm') as HTMLFormElement;
    // fill the first recipient
    await populateForm(form, 0, newNotification.recipients[0]);
    const submitButton = within(form).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      const state = testStore.getState();
      expect(state.newNotificationState.notification.recipients).toStrictEqual([
        recipientsWithoutPayments[0],
      ]);
    });
    expect(confirmHandlerMk).toHaveBeenCalledTimes(1);
  });
});
