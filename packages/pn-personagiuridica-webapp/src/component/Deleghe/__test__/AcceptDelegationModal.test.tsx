import React from 'react';

import { fireEvent, render, screen, testAutocomplete, waitFor } from '../../../__test__/test-utils';
import AcceptDelegationModal from '../AcceptDelegationModal';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const confirmCbk = jest.fn();
const cancelCbk = jest.fn();

describe('AcceptDelegationModal', () => {
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
    const dialog = screen.queryByTestId('codeDialog') as Element;
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
    const dialog = screen.queryByTestId('codeDialog') as Element;
    const codeConfirmButton = dialog.querySelector('[data-testid="codeConfirmButton"]') as Element;
    const codeCancelButton = dialog.querySelector('[data-testid="codeCancelButton"]') as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
    expect(dialog).toBeInTheDocument();
    const noGroupRadio = dialog.querySelector('[data-testid="no-group"] input') as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
    expect(dialog).toBeInTheDocument();
    const associateGroupRadio = dialog.querySelector(
      '[data-testid="associate-group"] input'
    ) as Element;
    expect(associateGroupRadio).toBeChecked();
    const autocomplete = dialog.querySelector(`[data-testid="groups"]`) as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
    const groupConfirmButton = dialog.querySelector(
      '[data-testid="groupConfirmButton"]'
    ) as Element;
    const groupCancelButton = dialog.querySelector('[data-testid="groupCancelButton"]') as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
    const groupConfirmButton = dialog.querySelector(
      '[data-testid="groupConfirmButton"]'
    ) as Element;
    const associateGroupRadio = dialog.querySelector('[data-testid="associate-group"]') as Element;
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
    let codeDialog = screen.queryByTestId('codeDialog') as Element;
    const codeConfirmButton = codeDialog.querySelector(
      '[data-testid="codeConfirmButton"]'
    ) as Element;
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
    const groupCancelButton = groupDialog.querySelector(
      '[data-testid="groupCancelButton"]'
    ) as Element;
    expect(groupCancelButton).toHaveTextContent('button.indietro');
    fireEvent.click(groupCancelButton);
    await waitFor(() => {
      codeDialog = screen.queryByTestId('codeDialog') as Element;
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
    const codeDialog = screen.queryByTestId('codeDialog') as Element;
    const codeConfirmButton = codeDialog.querySelector(
      '[data-testid="codeConfirmButton"]'
    ) as Element;
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
    const codeDialog = screen.queryByTestId('codeDialog') as Element;
    const codeConfirmButton = codeDialog.querySelector(
      '[data-testid="codeConfirmButton"]'
    ) as Element;
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
    const associateGroupRadio = await waitFor(
      () => groupDialog.querySelector('[data-testid="associate-group"]') as Element
    );
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(groupDialog, 'groups', groups, true, 1);
    const groupConfirmButton = groupDialog.querySelector(
      '[data-testid="groupConfirmButton"]'
    ) as Element;
    fireEvent.click(groupConfirmButton);
    expect(confirmCbk).toBeCalledTimes(1);
    expect(confirmCbk).toBeCalledWith(['0', '1', '2', '3', '4'], [groups[1]]);
  });
});
