import { act, fireEvent } from '@testing-library/react';
import { render } from '../../../../__test__/test-utils';
import Recipient from '../Recipient';

describe('Recipient Component', () => {
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

  it('renders the second card', async () => {
    const result = render(<Recipient />);
    expect(result?.container).not.toHaveTextContent(/Destinatario 1/i);
    expect(result?.container).not.toHaveTextContent(/Destinatario 2/i);
    const addButton = result.queryByText('Aggiungi un destinatario');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const deleteIcon = result.queryAllByTestId('DeleteRecipientIcon');

    expect(result?.container).toHaveTextContent(/Destinatario 1/i);
    expect(result?.container).toHaveTextContent(/Destinatario 2/i);
    expect(deleteIcon).toHaveLength(2);
  });
});
