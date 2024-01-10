import React from 'react';

import { Box } from '@mui/material';

import { render } from '../../../../test-utils';
import SmartActions from '../SmartActions';

describe('SmartActions', () => {
  it('render component', () => {
    const { container, getAllByTestId } = render(
      <SmartActions>
        <Box data-testid="action">Action 1</Box>
        <Box data-testid="action">Action 2</Box>
        <Box data-testid="action">Action 3</Box>
      </SmartActions>
    );
    const actionContainer = getAllByTestId('action');
    expect(actionContainer).toHaveLength(3);
    expect(container).toHaveTextContent('Action 1');
    expect(container).toHaveTextContent('Action 2');
    expect(container).toHaveTextContent('Action 3');
  });
});
