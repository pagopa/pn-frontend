import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { render, testInput } from '../../../../__test__/test-utils';
import Recipient from '../Recipient';
import { formRecipients } from '../../../../utils/__test__/test-utils';

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

const populateForm = async (form: HTMLFormElement) => {
  await testInput(form, `recipients[0].firstName`, formRecipients[0].firstName);
  await testInput(form, `recipients[0].lastName`, formRecipients[0].lastName);
  await testInput(form, `recipients[0].taxId`, formRecipients[0].taxId);
  await testInput(form, `recipients[0].creditorTaxId`, formRecipients[0].creditorTaxId);
  await testInput(form, `recipients[0].noticeCode`, formRecipients[0].noticeCode);
  const checkbox = form.querySelector(`input[name="recipients[0].showPhysicalAddress"]`);
  fireEvent.click(checkbox!);
  await testInput(form, `recipients[0].address`, formRecipients[0].address);
  await testInput(form, `recipients[0].houseNumber`, formRecipients[0].houseNumber);
  await testInput(form, `recipients[0].zip`, formRecipients[0].zip);
  await testInput(form, `recipients[0].province`, formRecipients[0].province);
  await testInput(form, `recipients[0].foreignState`, formRecipients[0].foreignState);
};

describe('Recipient Component', () => {
  let result: RenderResult;

  beforeEach(async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(<Recipient onConfirm={() => {}} />);
    });
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('renders Recipient', () => {
    expect(result.container).toHaveTextContent(/Destinatario/i);
    expect(result.container).toHaveTextContent(/Soggetto giuridico*/i);
    expect(result.container).toHaveTextContent(/Persona fisica/i);
    expect(result.container).toHaveTextContent(/Persona giuridica/i);
    expect(result.container).toHaveTextContent(/Aggiungi un domicilio digitale/i);
    expect(result.container).toHaveTextContent(/Aggiungi un indirizzo fisico/i);
    expect(result.container).toHaveTextContent(/Aggiungi un destinatario/i);
    expect(result.container).toHaveTextContent(/Torna alle Notifiche/i);
    expect(result.container).toHaveTextContent(/Continua/i);
  });

  it('renders the second card, then deletes it', async () => {
    expect(result.container).not.toHaveTextContent(/Destinatario 1/i);
    expect(result.container).not.toHaveTextContent(/Destinatario 2/i);
    const addButton = result.queryByText('Aggiungi un destinatario');
    fireEvent.click(addButton!);
    const deleteIcon = await waitFor(() => result.queryAllByTestId('DeleteRecipientIcon'));
    expect(result.container).toHaveTextContent(/Destinatario 1/i);
    expect(result.container).toHaveTextContent(/Destinatario 2/i);
    expect(deleteIcon).toHaveLength(2);
    fireEvent.click(deleteIcon[1]);
    await waitFor(() => expect(result?.container).not.toHaveTextContent(/Destinatario 2/i));
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

  it('tests form validation (firstname)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].firstName`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (lastname)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].lastName`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (tax id)', async () => {
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

  it('tests form validation (creditor tax id)', async () => {
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

  it('tests form validation (notice code)', async () => {
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

  it('tests form validation (address)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].address`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (house number)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].houseNumber`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (zip)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].zip`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (province)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].province`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests form validation (foreign state)', async () => {
    const form = result.container.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
    await populateForm(form);
    expect(submitButton).toBeEnabled();
    await testInput(form, `recipients[0].foreignState`, '');
    expect(submitButton).toBeDisabled();
  }, 20000);

  it('tests the form inputs and submit function', async () => {
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
