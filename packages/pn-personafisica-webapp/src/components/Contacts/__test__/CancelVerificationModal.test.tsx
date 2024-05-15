import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, testStore, within } from '../../../__test__/test-utils';
import { AddressType } from '../../../models/contacts';
import CancelVerificationModal from '../CancelVerificationModal';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockCloseHandler = vi.fn();

describe('CancelVerificationModal component', async () => {
  it('renders component and clicks on cancel button', () => {
    render(<CancelVerificationModal open handleClose={mockCloseHandler} />);
    const dialog = screen.getByTestId('cancelVerificationModal');
    expect(dialog).toHaveTextContent('legal-contacts.validation-cancel-title');
    expect(dialog).toHaveTextContent('legal-contacts.validation-cancel-content');
    const buttons = within(dialog).getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('button.annulla');
    expect(buttons[1]).toHaveTextContent('button.conferma');
    fireEvent.click(buttons[0]);
    expect(mockCloseHandler).toBeCalledTimes(1);
  });

  it('clicks on confirm button', () => {
    render(<CancelVerificationModal open handleClose={mockCloseHandler} />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });
    const dialog = screen.getByTestId('cancelVerificationModal');
    const buttons = within(dialog).getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(
      digitalAddresses.filter(
        (addr) => addr.addressType === AddressType.LEGAL && addr.senderId !== 'default'
      )
    );
  });
});
