import { DialogTitle } from '@mui/material';

import { createMatchMedia, render } from '../../../test-utils';
import PnDialog from '../PnDialog';
import PnDialogContent from '../PnDialogContent';

describe('PnDialog Component', () => {
  it('renders component - desktop', () => {
    window.matchMedia = createMatchMedia(2000);
    const { queryByTestId } = render(
      <PnDialog open>
        <DialogTitle data-testid="dialog-title">Title</DialogTitle>
        <PnDialogContent>
          <div data-testid="dialog-other-content">Other content</div>
        </PnDialogContent>
      </PnDialog>
    );

    const content = queryByTestId('dialog');
    expect(content).toBeInTheDocument();
    const subtitle = queryByTestId('dialog-title');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveStyle('padding: 32px 32px 16px 32px;');
    const otherContent = queryByTestId('dialog-other-content');
    expect(otherContent).toBeInTheDocument();
  });

  it('renders component - mobile', () => {
    window.matchMedia = createMatchMedia(500);
    const { queryByTestId } = render(
      <PnDialog open>
        <DialogTitle data-testid="dialog-title">Title</DialogTitle>
        <PnDialogContent>
          <div data-testid="dialog-other-content">Other content</div>
        </PnDialogContent>
      </PnDialog>
    );

    const content = queryByTestId('dialog');
    expect(content).toBeInTheDocument();
    const subtitle = queryByTestId('dialog-title');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveStyle('padding: 24px 24px 16px 24px');
    const otherContent = queryByTestId('dialog-other-content');
    expect(otherContent).toBeInTheDocument();
  });
});
