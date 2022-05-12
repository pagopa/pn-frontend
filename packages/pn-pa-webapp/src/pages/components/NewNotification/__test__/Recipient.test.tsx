import { act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../../../__test__/test-utils';
import Recipient from '../Recipient';
import { formRecipients } from '../../../../utils/__test__/test-utils';
import { testInput } from './test-utils';

jest.mock('../PhysicalAddress', () => ({
  __esModule: true,
  default: () => <div>PhysicalAddress Component</div>,
}));

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

describe('Recipient Component', () => {
  afterEach(() => {
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('renders Recipient', () => {
    // render component
    const result = render(<Recipient />);
    expect(result?.container).toHaveTextContent(/Destinatario/i);
    expect(result?.container).toHaveTextContent(/Soggetto giuridico*/i);
    expect(result?.container).toHaveTextContent(/Persona fisica/i);
    expect(result?.container).toHaveTextContent(/Persona giuridica/i);
    expect(result?.container).toHaveTextContent(/Aggiungi un domicilio digitale/i);
    expect(result?.container).toHaveTextContent(/Aggiungi un indirizzo fisico/i);
    expect(result?.container).toHaveTextContent(/Aggiungi un destinatario/i);
    expect(result?.container).toHaveTextContent(/Torna alle Notifiche/i);
    expect(result?.container).toHaveTextContent(/Continua/i);
  });

  it('renders the second card, then deletes it', async () => {
    const result = render(<Recipient />);
    expect(result?.container).not.toHaveTextContent(/Destinatario 1/i);
    expect(result?.container).not.toHaveTextContent(/Destinatario 2/i);
    const addButton = result.queryByText('Aggiungi un destinatario');

    await act(async () => {
      fireEvent.click(addButton!);
    });

    const deleteIcon = result.queryAllByTestId('DeleteRecipientIcon');

    expect(result?.container).toHaveTextContent(/Destinatario 1/i);
    expect(result?.container).toHaveTextContent(/Destinatario 2/i);
    expect(deleteIcon).toHaveLength(2);

    await act(async () => {
      fireEvent.click(deleteIcon[1]);
    });
    expect(result?.container).not.toHaveTextContent(/Destinatario 2/i);
  });

  it('tests the form inputs and submit function', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    const result = render(<Recipient />);
    const form = result.container.querySelector('form') as HTMLFormElement;

    await testInput(form!, `recipients[0].firstName`, formRecipients[0].firstName);
    await testInput(form!, `recipients[0].lastName`, formRecipients[0].lastName);
    await testInput(form!, `recipients[0].taxId`, formRecipients[0].taxId);
    await testInput(form!, `recipients[0].creditorTaxId`, formRecipients[0].creditorTaxId);
    await testInput(form!, `recipients[0].noticeCode`, formRecipients[0].noticeCode);

    const errors = result!.queryAllByText(/Campo Obbligatorio/i);
    expect(errors).toHaveLength(0);
    const submitButton = form!.querySelector('button[type="submit"]');
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton!);

    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalled();
    });
  });

  it('shows the digital domicile form and the physical address form', async () => {
    const result = render(<Recipient />);

    const digitalDomicileCheckbox = result.getByTestId('DigitalDomicileCheckbox');
    const physicalAddressCheckbox = result.getByTestId('PhysicalAddressCheckbox');
    const digitalDomicileInputBefore = result.container.querySelector(
      'input[name="recipients[0].digitalDomicile"]'
    );
    expect(digitalDomicileInputBefore).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(digitalDomicileCheckbox);
      fireEvent.click(physicalAddressCheckbox);
    });
    const digitalDomicileInputAfter = result.container.querySelector(
      'input[name="recipients[0].digitalDomicile"]'
    );

    expect(result.container).toHaveTextContent(/PhysicalAddress Component/i);
    expect(digitalDomicileInputAfter).toBeInTheDocument();
  });
});
