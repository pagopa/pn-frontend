import React from 'react';

import { Box } from '@mui/material';

import { render } from '../../../../test-utils';
import PnCardActions from '../PnCardActions';

describe('PnCardActions', () => {
  it('render component', () => {
    const { container, getAllByTestId } = render(
      <PnCardActions testId="container">
        <Box>Action 1</Box>
        <Box>Action 2</Box>
        <Box>Action 3</Box>
      </PnCardActions>
    );
    const actionContainer = getAllByTestId('container.action');
    expect(actionContainer).toHaveLength(3);
    expect(container).toHaveTextContent('Action 1');
    expect(container).toHaveTextContent('Action 2');
    expect(container).toHaveTextContent('Action 3');
  });

  it('render component - invalid element', () => {
    const { container, queryByTestId } = render(
      <PnCardActions testId="container">Action 1</PnCardActions>
    );
    const actionContainer = queryByTestId('container.action');
    expect(actionContainer).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Action 1');
  });
});
