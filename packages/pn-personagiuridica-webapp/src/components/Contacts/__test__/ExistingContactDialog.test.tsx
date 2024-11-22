import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
import ExistingContactDialog from '../ExistingContactDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeHandler = vi.fn();
const confirmHandler = vi.fn();

describe('ExistingContactDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - confirmation modal visible', () => {
    // render component
    render(
      <ExistingContactDialog
        open
        value="value"
        handleDiscard={closeHandler}
        handleConfirm={confirmHandler}
      />
    );
    const dialog = screen.getByTestId('duplicateDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('common.duplicate-contact-title');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('common.duplicate-contact-descr');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = screen.getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
  });

  it('click on confirm button', () => {
    // render component
    render(
      <ExistingContactDialog
        open
        value="value"
        handleDiscard={closeHandler}
        handleConfirm={confirmHandler}
      />
    );
    const confirmButton = screen.getByText('button.conferma');
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalled();
  });

  it('click on cancel button', () => {
    // render component
    render(
      <ExistingContactDialog
        open
        value="value"
        handleDiscard={closeHandler}
        handleConfirm={confirmHandler}
      />
    );
    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalled();
  });
});
