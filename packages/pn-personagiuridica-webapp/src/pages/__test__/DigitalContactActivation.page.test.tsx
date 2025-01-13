import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../__mocks__/Contacts.mock';
import { fireEvent, render, within } from '../../__test__/test-utils';
import { ChannelType } from '../../models/contacts';
import DigitalContactActivation from '../DigitalContactActivation.page';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactActivation', () => {
  it('render component', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const title = getByText('legal-contacts.sercq-send-wizard.title');
    expect(title).toBeInTheDocument();
  });

  it('should go back when clicking on the back button', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const backButton = getByText('button.annulla');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });

  it('renders pec contact wizard correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const pecSection = getByTestId('pec-section');
    expect(pecSection).toBeInTheDocument();
    const pecButton = within(pecSection).getByRole('button');
    fireEvent.click(pecButton);
    const pecWizard = getByTestId('pec-contact-wizard');
    expect(pecWizard).toBeInTheDocument();
  });

  it('renders pec contact wizard if SERCQ SEND is already enabled', () => {
    const { getByTestId } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq.filter(
            (addr) => addr.channelType === ChannelType.SERCQ_SEND
          ),
        },
      },
    });
    const pecSection = getByTestId('pec-contact-wizard');
    expect(pecSection).toBeInTheDocument();
  });
});
