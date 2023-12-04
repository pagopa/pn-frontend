import React from 'react';

import { fireEvent, render } from '../../test-utils';
import DisclaimerModal from '../DisclaimerModal';

const mockConfirm = jest.fn();
const mockCancel = jest.fn();

describe('DisclaimerModal tests', () => {
  it('checks that the modal renders correctly', () => {
    const { baseElement } = render(
      <DisclaimerModal
        onConfirm={mockConfirm}
        onCancel={mockCancel}
        confirmLabel={'Conferma'}
        checkboxLabel={'Ho capito'}
        content={'test content'}
      />
    );
    expect(baseElement).toHaveTextContent('test content');
    expect(baseElement).toHaveTextContent('Ho capito');
  });

  it('checks that callback functions are called correctly when clicking on buttons', () => {
    const { getByRole } = render(
      <DisclaimerModal
        onConfirm={mockConfirm}
        onCancel={mockCancel}
        confirmLabel={'Conferma'}
        checkboxLabel={'Ho capito'}
      />
    );
    const cancelButton = getByRole('button', { name: 'Annulla' });
    const confirmButton = getByRole('button', { name: 'Conferma' });
    const checkbox = getByRole('checkbox');
    fireEvent.click(cancelButton);
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    expect(mockCancel).toBeCalledTimes(1);
    expect(mockConfirm).toBeCalledTimes(0);
    fireEvent.click(checkbox);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    expect(mockConfirm).toBeCalledTimes(1);
  });
});
