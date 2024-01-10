import { Button } from '@mui/material';

import { createMatchMedia, render } from '../../../test-utils';
import PnDialogActions from '../PnDialogActions';

describe('PnDialogActions Component', () => {
  it('renders component - desktop', () => {
    window.matchMedia = createMatchMedia(2000);
    const { queryByTestId, queryAllByTestId } = render(
      <PnDialogActions>
        <Button data-testid="button">Test confirm button</Button>
        <Button data-testid="button">Test cancel button</Button>
      </PnDialogActions>
    );

    const actions = queryByTestId('dialog-actions');
    expect(actions).toBeInTheDocument();
    expect(actions).toHaveClass('MuiDialogActions-spacing');
    expect(actions).toHaveStyle('flex-direction: row; padding: 32px; gap: 8px;');
    const buttons = queryAllByTestId('button');
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).not.toHaveClass('MuiButton-fullWidth');
      expect(button).toHaveStyle('margin-top: 0');
    }
  });

  it('renders component - mobile', () => {
    window.matchMedia = createMatchMedia(800);
    const { queryByTestId, queryAllByTestId } = render(
      <PnDialogActions>
        <Button data-testid="button">Test confirm button</Button>
        <Button data-testid="button">Test cancel button</Button>
      </PnDialogActions>
    );

    const actions = queryByTestId('dialog-actions');
    expect(actions).toBeInTheDocument();
    expect(actions).not.toHaveClass('MuiDialogActions-spacing');
    expect(actions).toHaveStyle('flex-direction: column-reverse; padding: 24px; gap: 0px;');
    const buttons = queryAllByTestId('button');
    expect(buttons).toHaveLength(2);
    buttons.forEach((button, index) => {
      expect(button).toHaveClass('MuiButton-fullWidth');
      expect(button).toHaveStyle(index === 0 ? 'margin-bottom: 0' : 'margin-bottom: 16px');
    });
  });
});
