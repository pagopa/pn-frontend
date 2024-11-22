import { vi } from 'vitest';

import { getById, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import PecValueDialog from '../PecValueDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeHandler = vi.fn();
const confirmHandler = vi.fn();

describe('PecVerificationDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', async () => {
    // render component
    render(<PecValueDialog open onConfirm={confirmHandler} onDiscard={closeHandler} />);
    const dialog = screen.getByTestId('pecValueDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.sercq-send-add-pec');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-add-pec-description');
    await testInput(dialog, `default_modal_pec`, '');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    const cancelButton = screen.getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
  });

  it('fills pec with wrong value', async () => {
    // render component
    render(<PecValueDialog open onConfirm={confirmHandler} onDiscard={closeHandler} />);
    const dialog = screen.getByTestId('pecValueDialog');
    await testInput(dialog, `default_modal_pec`, 'wrong-value');
    const errorMessage = getById(dialog, 'default_modal_pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeDisabled();
  });

  it('fills pec and clicks on confirm', async () => {
    // render component
    render(<PecValueDialog open onConfirm={confirmHandler} onDiscard={closeHandler} />);
    const dialog = screen.getByTestId('pecValueDialog');
    await testInput(dialog, `default_modal_pec`, 'pec@mocked.it');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('pec@mocked.it');
    });
  });

  it('clicks on cancel', () => {
    // render component
    render(<PecValueDialog open onConfirm={confirmHandler} onDiscard={closeHandler} />);
    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});
