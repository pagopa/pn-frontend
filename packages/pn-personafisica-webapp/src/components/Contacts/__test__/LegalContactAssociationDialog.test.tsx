import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import LegalContactAssociationDialog from '../LegalContactAssociationDialog';

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
        senderName="mockedSenderName"
        newAddressValue="new-pec@mail.it"
        oldAddressValue="old-pec@mail.it"
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
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
  });

  it('click on confirm button', () => {
    // render component
    render(
      <LegalContactAssociationDialog
        open
        senderName="mockedSenderName"
        newAddressValue="new-pec@mail.it"
        oldAddressValue="old-pec@mail.it"
        handleClose={closeHandler}
        handleConfirm={confirmHandler}
      />
    );
    const confirmButton = screen.getByText('button.conferma');
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
  });

  it('click on cancel button', () => {
    // render component
    render(
      <LegalContactAssociationDialog
        open
        senderName="mockedSenderName"
        newAddressValue="new-pec@mail.it"
        oldAddressValue="old-pec@mail.it"
        handleClose={closeHandler}
        handleConfirm={confirmHandler}
      />
    );
    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});
