import { vi } from 'vitest';

import { Button } from '@mui/material';

import { fireEvent, render } from '../../test-utils';
import ConfirmationModal from '../ConfirmationModal';

const mockCloseFunction = vi.fn();
const mockConfirmFunction = vi.fn();

describe('ConfirmationModal Component', () => {
  it('renders the component', () => {
    const { getByRole, getByTestId } = render(
      <ConfirmationModal
        open
        title={'Test title'}
        slots={{ confirmButton: Button, closeButton: Button }}
        slotsProps={{
          closeButton: { onClick: mockCloseFunction, children: 'Close' },
          confirmButton: { onClick: mockConfirmFunction, children: 'Confirm' },
        }}
      />
    );

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    const confirmButton = getByTestId('confirmButton');
    const closeButton = getByTestId('closeButton');
    expect(confirmButton).toHaveTextContent(/Confirm/i);
    expect(closeButton).toHaveTextContent(/Close/i);
  });

  it('checks that the confirm and close functions are executed', () => {
    const { getByTestId } = render(
      <ConfirmationModal
        open
        title={'Test title'}
        slots={{ confirmButton: Button, closeButton: Button }}
        slotsProps={{
          closeButton: { onClick: mockCloseFunction, children: 'Close' },
          confirmButton: { onClick: mockConfirmFunction, children: 'Confirm' },
        }}
      />
    );

    const confirmButton = getByTestId('confirmButton');
    const closeButton = getByTestId('closeButton');
    fireEvent.click(confirmButton);
    expect(mockConfirmFunction).toHaveBeenCalledTimes(1);
    fireEvent.click(closeButton);
    expect(mockCloseFunction).toHaveBeenCalledTimes(1);
  });

  it('renders the dialog with no close button', () => {
    const { getByTestId, queryByTestId } = render(
      <ConfirmationModal
        open
        title={'Test title'}
        slots={{ confirmButton: Button }}
        slotsProps={{
          confirmButton: { onClick: mockConfirmFunction, children: 'Confirm' },
        }}
      />
    );

    const confirmButton = getByTestId('confirmButton');
    const closeButton = queryByTestId('closeButton');
    expect(confirmButton).toHaveTextContent(/Confirm/i);
    expect(closeButton).not.toBeInTheDocument();
  });

  it('renders the dialog with children', () => {
    const { getByRole } = render(
      <ConfirmationModal
        open
        title={'Test title'}
        slotsProps={{
          closeButton: { onClick: mockCloseFunction, children: 'Close' },
          confirmButton: { onClick: mockConfirmFunction, children: 'Confirm' },
        }}
      >
        <p>Test Content</p>
      </ConfirmationModal>
    );
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Test Content/i);
  });
});
