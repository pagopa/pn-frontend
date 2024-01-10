import { fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialogContent Component', () => {
  it('renders component', async () => {
    const { container } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title="Mocked title">Mocked content</CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    // open dialog
    const button = container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Mocked title/i);
    expect(dialog).toHaveTextContent(/Mocked content/i);
  });

  it('clicks on close icon', async () => {
    const { container } = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title="Mocked title">Mocked content</CustomMobileDialogContent>
      </CustomMobileDialog>
    );
    // open dialog
    const button = container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const closeIcon = within(dialog!).queryByTestId('CloseIcon');
    fireEvent.click(closeIcon!);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
