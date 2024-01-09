import { vi } from 'vitest';

import { axe, fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import AcceptDelegationModal from '../AcceptDelegationModal';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('AcceptDelegationModal - accessibility tests', () => {
  it('is AcceptDelegationModal component accessible - first step', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={false}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={() => {}}
        handleConfirm={() => {}}
      />
    );
    const dialog = screen.getByTestId('codeDialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });

  it('is AcceptDelegationModal component accessible - second step - no group selected', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={true}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={() => {}}
        handleConfirm={() => {}}
      />
    );
    const dialog = screen.getByTestId('groupDialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });

  it('is AcceptDelegationModal component accessible - second step - group selected', async () => {
    render(
      <AcceptDelegationModal
        isEditMode={true}
        open
        name="Mario Rossi"
        handleCloseAcceptModal={() => {}}
        handleConfirm={() => {}}
      />
    );
    const dialog = screen.getByTestId('groupDialog');
    const results = await axe(dialog);
    const associateGroupRadio = within(dialog).getByTestId('associate-group');
    fireEvent.click(associateGroupRadio);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
