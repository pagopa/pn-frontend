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
    expect(actions).toHaveStyle('flex-direction: row; padding: 0px 32px 32px 32px;');
    const buttons = queryAllByTestId('button');
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).not.toHaveClass('MuiButton-fullWidth');
      expect(button).toHaveStyle('margin-top: 0');
    }
  });

  it('renders component - mobile', () => {
    window.matchMedia = createMatchMedia(500);
    const { queryByTestId, queryAllByTestId } = render(
      <PnDialogActions>
        <Button data-testid="button">Test confirm button</Button>
        <Button data-testid="button">Test cancel button</Button>
      </PnDialogActions>
    );

    const actions = queryByTestId('dialog-actions');
    expect(actions).toBeInTheDocument();
    expect(actions).not.toHaveClass('MuiDialogActions-spacing');
    expect(actions).toHaveStyle('flex-direction: column-reverse; padding: 0px 24px 24px 24px;');
    const buttons = queryAllByTestId('button');
    expect(buttons).toHaveLength(2);
    buttons.forEach((button, index) => {
      expect(button).toHaveStyle(
        index === 0 ? 'margin-bottom: 0' : 'margin-bottom: 16px; width: 100%'
      );
    });
  });
});
