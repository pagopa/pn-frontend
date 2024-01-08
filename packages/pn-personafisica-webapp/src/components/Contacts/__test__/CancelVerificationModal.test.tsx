import * as React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import CancelVerificationModal from '../CancelVerificationModal';

// this is needed because there is a bug when vi.mock is used
// https://github.com/vitest-dev/vitest/issues/3300
// maybe with vitest 1, we can remove the workaround
const testUtils = await import('../../../__test__/test-utils');

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockCloseHandler = vi.fn();

describe('CancelVerificationModal component', () => {
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
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.legal).toStrictEqual(
      digitalAddresses.legal.filter((addr) => addr.senderId !== 'default')
    );
  });
});
