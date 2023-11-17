import React from 'react';
import { vi } from 'vitest';

import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import AcceptDelegationModal from '../AcceptDelegationModal';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

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

  it('calls cancel callback - codeModal', () => {
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
    expect(codeConfirmButton).toBeDisabled();
    fireEvent.click(codeCancelButton);
    expect(cancelCbk).toBeCalledTimes(1);
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
    const autocomplete = within(dialog).getByTestId(`groups`);
    expect(autocomplete).toHaveTextContent(groups[1].name);
  });

  it('calls cancel callback - groupModal', () => {
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
    fireEvent.click(groupCancelButton);
    expect(cancelCbk).toBeCalledTimes(1);
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
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(dialog, 'groups', groups, true, 1);
    expect(groupConfirmButton).toBeEnabled();
    fireEvent.click(groupConfirmButton);
    expect(confirmCbk).toBeCalledTimes(1);
    expect(confirmCbk).toBeCalledWith([], [groups[1]]);
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
    expect(codeConfirmButton).toBeDisabled();
    const codeInputs = codeDialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    fireEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.findByTestId('groupDialog'));
    expect(codeDialog).not.toBeInTheDocument();
    expect(groupDialog).toBeInTheDocument();
    // go to previous step and check that inputs are filled with previous values
    const groupCancelButton = within(groupDialog).getByTestId('groupCancelButton');
    expect(groupCancelButton).toHaveTextContent('button.indietro');
    fireEvent.click(groupCancelButton);
    await waitFor(() => {
      codeDialog = screen.getByTestId('codeDialog');
      expect(groupDialog).not.toBeInTheDocument();
    });
    expect(codeDialog).toBeInTheDocument();
    codeInputs.forEach((input, index) => {
      expect(input).toHaveValue(index.toString());
    });
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
    expect(codeConfirmButton).toBeDisabled();
    const codeInputs = codeDialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    expect(codeConfirmButton).toBeEnabled();
    fireEvent.click(codeConfirmButton);
    expect(confirmCbk).toBeCalledTimes(1);
    expect(confirmCbk).toBeCalledWith(['0', '1', '2', '3', '4'], []);
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
    expect(codeConfirmButton).toBeDisabled();
    const codeInputs = codeDialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    fireEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.findByTestId('groupDialog'));
    expect(codeDialog).not.toBeInTheDocument();
    expect(groupDialog).toBeInTheDocument();
    const associateGroupRadio = await waitFor(() =>
      within(groupDialog).getByTestId('associate-group')
    );
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(groupDialog, 'groups', groups, true, 1);
    const groupConfirmButton = within(groupDialog).getByTestId('groupConfirmButton');
    fireEvent.click(groupConfirmButton);
    expect(confirmCbk).toBeCalledTimes(1);
    expect(confirmCbk).toBeCalledWith(['0', '1', '2', '3', '4'], [groups[1]]);
  });
});
