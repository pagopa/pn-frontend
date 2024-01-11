import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { RenderResult, fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import CustomMobileDialogAction from '../CustomMobileDialogAction';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialog Component', () => {
  let result: RenderResult;

  beforeEach(() => {
    // render component
    result = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle>Mocked title</CustomMobileDialogToggle>
        <CustomMobileDialogContent title="Mocked title">
          <DialogContent>
            <p>Mocked content</p>
          </DialogContent>
          <DialogActions>
            <CustomMobileDialogAction closeOnClick>
              <div>Confirm</div>
            </CustomMobileDialogAction>
            <CustomMobileDialogAction>
              <div>Cancel</div>
            </CustomMobileDialogAction>
          </DialogActions>
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
  });

  it('renders CustomMobileDialog (closed)', () => {
    const button = result.getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/Mocked title/i);
  });

  it('renders CustomMobileDialog (opened)', async () => {
    const button = result.getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Mocked title/i);
    expect(dialog).toHaveTextContent(/Mocked content/i);
    const actions = within(dialog).getAllByTestId('dialogAction');
    expect(actions).toHaveLength(2);
    expect(actions[0]).toHaveTextContent(/Confirm/i);
    expect(actions[1]).toHaveTextContent(/Cancel/i);
  });

  it('clicks on confirm button', async () => {
    const button = result.getByTestId('dialogToggleButton');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const actions = within(dialog).getAllByTestId('dialogAction');
    fireEvent.click(actions[0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('clicks on cancel button', async () => {
    const button = result.getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const actions = within(dialog).getAllByTestId('dialogAction');
    fireEvent.click(actions[1]);
    await waitFor(() => expect(dialog).toBeInTheDocument());
  });
});
