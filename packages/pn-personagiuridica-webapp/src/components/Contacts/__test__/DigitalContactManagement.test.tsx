import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import DigitalContactManagement from '../DigitalContactManagement';

const mockNavigateWithStateFn = vi.fn();
const mockNavigateToPreviuosLocationFn = vi.fn();

vi.mock('@pagopa-pn/pn-commons', async () => ({
  ...(await vi.importActual<any>('@pagopa-pn/pn-commons')),
  usePreviousLocation: () => ({
    previousLocation: '/mocked-page',
    navigateWithState: mockNavigateWithStateFn,
    navigateToPreviousLocation: mockNavigateToPreviuosLocationFn,
  }),
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
    expect(mockNavigateToPreviuosLocationFn).toHaveBeenCalledTimes(1);
  });
});
