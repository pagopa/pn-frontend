import React from 'react';

import { fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import CustomMobileDialogAction from '../CustomMobileDialogAction';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialogAction Component', () => {
  it('renders component', async () => {
    const { container } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title="Mocked title">
          <CustomMobileDialogAction closeOnClick>Mocked action</CustomMobileDialogAction>
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    // open dialog
    const button = container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const action = within(dialog).getByTestId('dialogAction');
    expect(action).toHaveTextContent(/Mocked action/i);
  });

  it('clicks on action and close modal', async () => {
    const { container } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title="Mocked title">
          <CustomMobileDialogAction closeOnClick>Mocked action</CustomMobileDialogAction>
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    // open dialog
    const button = container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const action = within(dialog).getByTestId('dialogAction');
    fireEvent.click(action);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
