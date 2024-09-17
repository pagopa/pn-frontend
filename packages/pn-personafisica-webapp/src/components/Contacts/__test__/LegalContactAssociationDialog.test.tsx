import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
import LegalContactAssociationDialog from '../LegalContactAssociationDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const confirmHandler = vi.fn();
const closeHandler = vi.fn();

describe('LegalContactAssociationDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - confirmation modal visible', () => {
    // render component
    render(
      <LegalContactAssociationDialog
        open
        dialogContentText="special-contacts.legal-association-description"
        handleClose={confirmHandler}
        handleConfirm={closeHandler}
      />
    );
    const dialog = screen.getByTestId('legalContactAssociationDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('special-contacts.legal-association-title');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('special-contacts.legal-association-description');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = screen.getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
  });

  it.skip('click on confirm button', () => {
    // render component
    render(
      <LegalContactAssociationDialog
        open
        dialogContentText="special-contacts.legal-association-description"
        handleClose={confirmHandler}
        handleConfirm={closeHandler}
      />
    );
    const confirmButton = screen.getByText('button.conferma');
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
  });

  it.skip('click on cancel button', () => {
    // render component
    render(
      <LegalContactAssociationDialog
        open
        dialogContentText="special-contacts.legal-association-description"
        handleClose={confirmHandler}
        handleConfirm={closeHandler}
      />
    );

    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});
