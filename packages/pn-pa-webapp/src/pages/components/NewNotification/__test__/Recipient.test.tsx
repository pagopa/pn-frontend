import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { render, testInput } from '../../../../__test__/test-utils';
import Recipient from '../Recipient';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

const populateForm = async (form: HTMLFormElement) => {
  await testInput(form, `recipients[0].firstName`, newNotification.recipients[0].firstName);
  await testInput(form, `recipients[0].lastName`, newNotification.recipients[0].lastName);
  await testInput(form, `recipients[0].taxId`, newNotification.recipients[0].taxId);
  await testInput(form, `recipients[0].creditorTaxId`, newNotification.recipients[0].creditorTaxId);
  await testInput(form, `recipients[0].noticeCode`, newNotification.recipients[0].noticeCode);
  const checkbox = form.querySelector(`input[name="recipients[0].showPhysicalAddress"]`);
  fireEvent.click(checkbox!);
  await testInput(form, `recipients[0].address`, newNotification.recipients[0].address);
  await testInput(form, `recipients[0].houseNumber`, newNotification.recipients[0].houseNumber);
  await testInput(form, `recipients[0].municipality`, newNotification.recipients[0].municipality);
  await testInput(form, `recipients[0].zip`, newNotification.recipients[0].zip);
  await testInput(form, `recipients[0].province`, newNotification.recipients[0].province);
  await testInput(form, `recipients[0].foreignState`, newNotification.recipients[0].foreignState);
};

const populateFormMultipleRecipients = async (form: HTMLFormElement) => {
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < newNotification.recipients.length; i++) {
    const formRecipient = newNotification.recipients[i];
    await testInput(form, `recipients[${i}].firstName`, formRecipient.firstName);
    await testInput(form, `recipients[${i}].lastName`, formRecipient.lastName);
    await testInput(form, `recipients[${i}].taxId`, formRecipient.taxId);
    await testInput(form, `recipients[${i}].creditorTaxId`, formRecipient.creditorTaxId);
    await testInput(form, `recipients[${i}].noticeCode`, formRecipient.noticeCode);
    const checkbox = form.querySelector(`input[name="recipients[${i}].showPhysicalAddress"]`);
    fireEvent.click(checkbox!);
    await testInput(form, `recipients[${i}].address`, formRecipient.address);
    await testInput(form, `recipients[${i}].houseNumber`, formRecipient.houseNumber);
    await testInput(form, `recipients[${i}].zip`, formRecipient.zip);
    await testInput(form, `recipients[${i}].province`, formRecipient.province);
    await testInput(form, `recipients[${i}].foreignState`, formRecipient.foreignState);
  }
};

// TODO i'm skipping all very slow tests => they would be implemented using cypress as integration tests
// when validation is "detached" from the component, validation schema should be tested separately as UT with jest 
// ----------------------------------
// In the context of PN-2712, we decided to keep these tests skipped until the new, cypress-based tests are operative.
// Cfr PN-2962, open to implement the cypress-based tests. 
// Carlotta Dimatteo and Carlos Lombardi, 2022.12.14
// ----------------------------------

describe('Recipient Component', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult;

  beforeEach(async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(<Recipient paymentMode={newNotification.paymentMode} onConfirm={() => {}} />);
    });
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('renders Recipient', () => {
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/legal-entity*/i);
    expect(result.container).toHaveTextContent(/physical-person/i);
    expect(result.container).toHaveTextContent(/legal-person/i);
    expect(result.container).toHaveTextContent(/add-digital-domicile/i);
    expect(result.container).toHaveTextContent(/add-physical-domicile/i);
    expect(result.container).toHaveTextContent(/add-recipient/i);
    expect(result.container).toHaveTextContent(/back-to-preliminary-informations/i);
    expect(result.container).toHaveTextContent(/button.continue/i);
  });

  it('renders the second card, then deletes it', async () => {
    expect(result.container).not.toHaveTextContent(/title 1/i);
    expect(result.container).not.toHaveTextContent(/title 2/i);
    const addButton = result.queryByText('add-recipient');
    fireEvent.click(addButton!);
    const deleteIcon = await waitFor(() => result.queryAllByTestId('DeleteRecipientIcon'));
    expect(result.container).toHaveTextContent(/title 1/i);
    expect(result.container).toHaveTextContent(/title 2/i);
    expect(deleteIcon).toHaveLength(2);
    fireEvent.click(deleteIcon[1]);
    await waitFor(() => expect(result?.container).not.toHaveTextContent(/title 2/i));
  });

  it('renders the 5 cards, then add recipient should be disabled', async () => {
    expect(result.container).not.toHaveTextContent(/title 1/i);
    expect(result.container).not.toHaveTextContent(/title 2/i);
    const addButton1 = result.queryByText('add-recipient');
    fireEvent.click(addButton1!);
    const addButton2 = result.queryByText('add-recipient');
    fireEvent.click(addButton2!);
    const addButton3 = result.queryByText('add-recipient');
    fireEvent.click(addButton3!);
    const addButton4 = result.queryByText('add-recipient');
    fireEvent.click(addButton4!);
    await waitFor(() => {
      expect(result.container).toHaveTextContent(/title 1/i);
      expect(result.container).toHaveTextContent(/title 5/i);
      const addButton5 = result.queryByText('add-recipient');
      expect(addButton5).toBeNull();
    });
  });

  it('shows the digital domicile form and the physical address form', async () => {
    const digitalDomicileCheckbox = result.getByTestId('DigitalDomicileCheckbox');
    const physicalAddressCheckbox = result.getByTestId('PhysicalAddressCheckbox');
    const digitalDomicileInputBefore = result.container.querySelector(
      'input[name="recipients[0].digitalDomicile"]'
    );
    expect(digitalDomicileInputBefore).not.toBeInTheDocument();
    fireEvent.click(digitalDomicileCheckbox);
    fireEvent.click(physicalAddressCheckbox);
    const digitalDomicileInputAfter = await waitFor(() =>
      result.container.querySelector('input[name="recipients[0].digitalDomicile"]')
    );
    expect(digitalDomicileInputAfter).toBeInTheDocument();
    await waitFor(() => {
      const address = result.container.querySelector(`input[name="recipients[0].address"]`);
      expect(address).toBeInTheDocument();
      const houseNumber = result.container.querySelector(`input[name="recipients[0].houseNumber"]`);
      expect(houseNumber).toBeInTheDocument();
      const zip = result.container.querySelector(`input[name="recipients[0].zip"]`);
      expect(zip).toBeInTheDocument();
      const province = result.container.querySelector(`input[name="recipients[0].province"]`);
      expect(province).toBeInTheDocument();
      const foreignState = result.container.querySelector(
        `input[name="recipients[0].foreignState"]`
      );
      expect(foreignState).toBeInTheDocument();
    });
  });

  it.skip('tests form validation (firstname)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].firstName`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (lastname)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].lastName`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (tax id)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].taxId`, '');
    expect(submitButton).toBeDisabled();
    await testInput(form, `recipients[0].taxId`, 'wrong-tax-id');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (creditor tax id)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].creditorTaxId`, '');
    expect(submitButton).toBeDisabled();
    await testInput(form, `recipients[0].creditorTaxId`, 'wrong-creditor-tax-id');
    expect(submitButton).toBeDisabled();
    await testInput(form, `recipients[0].creditorTaxId`, '1234567890');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (notice code)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].noticeCode`, '');
    expect(submitButton).toBeDisabled();
    await testInput(form, `recipients[0].noticeCode`, '12345678912345678');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (address)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].address`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (house number)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].houseNumber`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (zip)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].zip`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (province)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].province`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation with correct data', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const addButton = result.queryByText('add-recipient');
    fireEvent.click(addButton!);
    await populateFormMultipleRecipients(form);
    expect(submitButton).toBeEnabled();
  }, 20000);

  it.skip('tests form validation (identical taxId)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const addButton = result.queryByText('add-recipient');
    fireEvent.click(addButton!);
    await populateFormMultipleRecipients(form);
    await testInput(form, `recipients[1].taxId`, newNotification.recipients[0].taxId);
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (identical creditorTaxId and noticeCode)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const addButton = result.queryByText('add-recipient');
    fireEvent.click(addButton!);
    await populateFormMultipleRecipients(form);
    await testInput(form, `recipients[1].noticeCode`, newNotification.recipients[0].noticeCode);
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests form validation (foreign state)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].foreignState`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it.skip('tests the form inputs and submit function', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    await populateForm(form);
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalled();
    });
  }, 20000);
});
