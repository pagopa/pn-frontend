import { vi } from 'vitest';

import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor, within } from '../../../__test__/test-utils';
import AcceptDelegationModal from '../AcceptDelegationModal';

const confirmCbk = vi.fn();
const cancelCbk = vi.fn();

describe('AcceptDelegationModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders CodeModal', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />
    );
    const dialog = screen.getByTestId('codeDialog') as Element;
    expect(dialog).toBeInTheDocument();
  });

  it('calls cancel callback - codeModal', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />
    );
    const dialog = screen.getByTestId('codeDialog');
    const codeConfirmButton = within(dialog).getByTestId('codeConfirmButton');
    const codeCancelButton = within(dialog).getByTestId('codeCancelButton');
    expect(codeConfirmButton).toBeEnabled();
    await userEvent.click(codeCancelButton);
    expect(cancelCbk).toHaveBeenCalledTimes(1);
  });

  it('renders GroupModal - no groups selected', () => {
    render(
      <AcceptDelegationModal
        isEditMode
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />
    );
    const dialog = screen.getByTestId('groupDialog');
    expect(dialog).toBeInTheDocument();
    const noGroupRadio = dialog.querySelector('[data-testid="no-group"] input');
    expect(noGroupRadio).toBeChecked();
  });

  it('renders GroupModal - groups selected', () => {
    const groups = [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
    ];
    render(
      <AcceptDelegationModal
        isEditMode
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
        currentGroups={[groups[1]]}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
          },
        },
      }
    );
    const dialog = screen.getByTestId('groupDialog');
    expect(dialog).toBeInTheDocument();
    const associateGroupRadio = dialog.querySelector('[data-testid="associate-group"] input');
    expect(associateGroupRadio).toBeChecked();
    const autocomplete = within(dialog).getByTestId(`modal-groups`);
    expect(autocomplete).toHaveTextContent(groups[1].name);
  });

  it('calls cancel callback - groupModal', async () => {
    render(
      <AcceptDelegationModal
        isEditMode
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />
    );
    const dialog = screen.getByTestId('groupDialog');
    const groupConfirmButton = within(dialog).getByTestId('groupConfirmButton');
    const groupCancelButton = within(dialog).getByTestId('groupCancelButton');
    expect(groupConfirmButton).toBeEnabled();
    expect(groupCancelButton).toHaveTextContent('button.annulla');
    await userEvent.click(groupCancelButton);
    expect(cancelCbk).toHaveBeenCalledTimes(1);
  });

  it('selects groups - groupModal', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
    ];
    render(
      <AcceptDelegationModal
        isEditMode
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
          },
        },
      }
    );
    const dialog = screen.getByTestId('groupDialog');
    const groupConfirmButton = within(dialog).getByTestId('groupConfirmButton');
    const associateGroupRadio = within(dialog).getByTestId('associate-group');
    await userEvent.click(associateGroupRadio);
    await testAutocomplete(dialog, 'modal-groups', groups, true, 1);
    expect(groupConfirmButton).toBeEnabled();
    await userEvent.click(groupConfirmButton);
    expect(confirmCbk).toHaveBeenCalledTimes(1);
    expect(confirmCbk).toHaveBeenCalledWith('', [groups[1]]);
  });

  it('fills the code, go next step and returns back', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
    ];
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
          },
        },
      }
    );
    let codeDialog = screen.getByTestId('codeDialog');
    const codeConfirmButton = within(codeDialog).getByTestId('codeConfirmButton');
    expect(codeConfirmButton).toBeEnabled();

    const code = '01234';
    const textbox = within(codeDialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(code);

    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    await userEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.findByTestId('groupDialog'));
    expect(codeDialog).not.toBeInTheDocument();
    expect(groupDialog).toBeInTheDocument();
    // go to previous step and check the code is preserved
    const groupCancelButton = within(groupDialog).getByTestId('groupCancelButton');
    expect(groupCancelButton).toHaveTextContent('button.indietro');
    await userEvent.click(groupCancelButton);
    await waitFor(() => {
      codeDialog = screen.getByTestId('codeDialog');
      expect(groupDialog).not.toBeInTheDocument();
    });
    expect(codeDialog).toBeInTheDocument();

    const textboxBack = within(codeDialog).getByRole('textbox');
    expect(textboxBack).toHaveValue(code);
  });

  it('fills the code and confirm - no groups', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />
    );
    const codeDialog = screen.getByTestId('codeDialog');
    const codeConfirmButton = within(codeDialog).getByTestId('codeConfirmButton');
    expect(codeConfirmButton).toBeEnabled();

    const code = '01234';
    const textbox = within(codeDialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(code);

    expect(codeConfirmButton).toBeEnabled();
    await userEvent.click(codeConfirmButton);

    expect(confirmCbk).toHaveBeenCalledTimes(1);
    expect(confirmCbk).toHaveBeenCalledWith(code, []);
  });

  it('fills the code, go next step, choose groups and confirm', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
    ];
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={cancelCbk}
        handleConfirm={confirmCbk}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
          },
        },
      }
    );
    const codeDialog = screen.getByTestId('codeDialog');
    const codeConfirmButton = within(codeDialog).getByTestId('codeConfirmButton');
    expect(codeConfirmButton).toBeEnabled();

    const code = '01234';
    const textbox = within(codeDialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(code);

    expect(codeConfirmButton).toBeEnabled();

    // got to next step
    await userEvent.click(codeConfirmButton);

    const groupDialog = await waitFor(() => screen.findByTestId('groupDialog'));
    expect(codeDialog).not.toBeInTheDocument();
    expect(groupDialog).toBeInTheDocument();

    const associateGroupRadio = await waitFor(() =>
      within(groupDialog).getByTestId('associate-group')
    );
    await userEvent.click(associateGroupRadio);

    await testAutocomplete(groupDialog, 'modal-groups', groups, true, 1);

    const groupConfirmButton = within(groupDialog).getByTestId('groupConfirmButton');
    await userEvent.click(groupConfirmButton);

    expect(confirmCbk).toHaveBeenCalledTimes(1);
    expect(confirmCbk).toHaveBeenCalledWith(code, [groups[1]]);
  });
});
