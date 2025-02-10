import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import DigitalContactManagement from '../DigitalContactManagement';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render main component', () => {
    const { container } = render(<DigitalContactManagement />);
    expect(container).toHaveTextContent('legal-contacts.digital-domicile-management.title');

    expect(container).toHaveTextContent('status.active');
  });

  it('render the digital domicile transfer wizard', () => {
    const { container, getByRole } = render(<DigitalContactManagement />);

    const transferButton = getByRole('button', {
      name: 'legal-contacts.digital-domicile-management.transfer.action-pec',
    });
    fireEvent.click(transferButton);
    expect(container).toHaveTextContent('legal-contacts.sercq-send-wizard.title-transfer');
  });

  it('should go back when clicking on the back button', () => {
    const { getByText } = render(<DigitalContactManagement />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq,
        },
      },
    });
    const backButton = getByText('button.indietro');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });
});
