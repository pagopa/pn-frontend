import React from 'react';
import { DialogContentText } from '@mui/material';

import { createMatchMedia, render } from '../../../test-utils';
import PnDialogContent from '../PnDialogContent';

describe('PnDialogContent Component', () => {
  it('renders component - desktop', () => {
    window.matchMedia = createMatchMedia(2000);
    const { queryByTestId } = render(
      <PnDialogContent>
        <DialogContentText data-testid="dialog-subtitle">Subtitle</DialogContentText>
        <div data-testid="dialog-other-content">Other content</div>
      </PnDialogContent>
    );

    const content = queryByTestId('dialog-content');
    expect(content).toBeInTheDocument();
    const subtitle = queryByTestId('dialog-subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveStyle('text-align: left');
    const otherContent = queryByTestId('dialog-other-content');
    expect(otherContent).toBeInTheDocument();
  });

  it('renders component - mobile', () => {
    window.matchMedia = createMatchMedia(800);
    const { queryByTestId } = render(
      <PnDialogContent>
        <DialogContentText data-testid="dialog-subtitle">Subtitle</DialogContentText>
        <div data-testid="dialog-other-content">Other content</div>
      </PnDialogContent>
    );

    const content = queryByTestId('dialog-content');
    expect(content).toBeInTheDocument();
    const subtitle = queryByTestId('dialog-subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveStyle('text-align: center');
    const otherContent = queryByTestId('dialog-other-content');
    expect(otherContent).toBeInTheDocument();
  });
});
