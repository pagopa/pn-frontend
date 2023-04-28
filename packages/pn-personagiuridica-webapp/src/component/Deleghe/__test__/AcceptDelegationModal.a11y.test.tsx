import * as React from 'react';

import { axe, fireEvent, prettyDOM, render, screen, waitFor } from '../../../__test__/test-utils';
import AcceptDelegationModal from '../AcceptDelegationModal';

jest.mock('react-i18next', () => ({
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
    const dialog = screen.queryByTestId('codeDialog') as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
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
    const dialog = screen.queryByTestId('groupDialog') as Element;
    const results = await axe(dialog);
    const associateGroupRadio = dialog.querySelector('[data-testid="associate-group"]') as Element;
    fireEvent.click(associateGroupRadio);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
