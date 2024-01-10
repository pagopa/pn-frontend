import { Box } from '@mui/material';

import { render } from '../../../../test-utils';
import PnCardActions from '../PnCardActions';

describe('PnCardActions', () => {
  it('render component', () => {
    const { container, getAllByTestId } = render(
      <PnCardActions>
        <Box data-testid="action">Action 1</Box>
        <Box data-testid="action">Action 2</Box>
        <Box data-testid="action">Action 3</Box>
      </PnCardActions>
    );
    const actionContainer = getAllByTestId('action');
    expect(actionContainer).toHaveLength(3);
    expect(container).toHaveTextContent('Action 1');
    expect(container).toHaveTextContent('Action 2');
    expect(container).toHaveTextContent('Action 3');
  });

  it('render component - not react element component', () => {
    const { getByTestId } = render(<PnCardActions testId="container">Action 1</PnCardActions>);
    const actionContainer = getByTestId('container');
    const container = actionContainer.querySelector('div');
    expect(container).not.toBeInTheDocument();
    expect(actionContainer).toHaveTextContent('Action 1');
  });
});
