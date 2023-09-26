import React from 'react';

import { fireEvent, getById, queryById, render, screen, waitFor } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialog Component', () => {
  it('renders component - with badge', () => {
    // render component
    const { container, getByTestId } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge bagdeCount={1}>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title={'mocked dialog toggle title'}>
          mocked content
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    const button = getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/mocked dialog toggle title/i);
    const badge = getById(container, 'dialogToggleBadge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('1');
    const dialog = screen.queryByTestId('mobileDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders component - without badge', () => {
    // render component
    const { container, getByTestId } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title={'mocked dialog toggle title'}>
          mocked content
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    const button = getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/mocked dialog toggle title/i);
    const badge = queryById(container, 'dialogToggleBadge');
    expect(badge).not.toBeInTheDocument();
  });

  it('clicks on button and opens the dialog', async () => {
    // render component
    const { container } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title={'mocked dialog toggle title'}>
          mocked content
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    const button = container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
  });
});
