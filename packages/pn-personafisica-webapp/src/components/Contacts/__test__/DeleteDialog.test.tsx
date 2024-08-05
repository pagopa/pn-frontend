import { vi } from 'vitest';

import { getById, queryById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
import DeleteDialog from '../DeleteDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeHandler = vi.fn();
const confirmHandler = vi.fn();

describe('DeleteDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - delete not blocked', () => {
    // render component
    render(
      <DeleteDialog
        showModal
        handleModalClose={closeHandler}
        removeModalTitle="remove-title"
        removeModalBody="remove-modal-body"
        blockDelete={false}
        confirmHandler={confirmHandler}
      />
    );
    const dialog = screen.getByTestId('dialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('remove-title');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('remove-modal-body');
    const confirmButton = getById(dialog, 'buttonConferma');
    expect(confirmButton).toBeInTheDocument();
    const cancelButton = getById(dialog, 'buttonAnnulla');
    expect(cancelButton).toBeInTheDocument();
    const closeButton = queryById(dialog, 'buttonClose');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('clicks on buttons - delete not blocked', () => {
    // render component
    render(
      <DeleteDialog
        showModal
        handleModalClose={closeHandler}
        removeModalTitle="remove-title"
        removeModalBody="remove-modal-body"
        blockDelete={false}
        confirmHandler={confirmHandler}
      />
    );
    const dialog = screen.getByTestId('dialog');
    const confirmButton = getById(dialog, 'buttonConferma');
    fireEvent.click(confirmButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
    const cancelButton = getById(dialog, 'buttonAnnulla');
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});
