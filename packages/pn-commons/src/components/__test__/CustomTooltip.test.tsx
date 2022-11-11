import { fireEvent, waitFor, screen } from '@testing-library/react';

import { render } from '../../test-utils';
import CustomTooltip from '../CustomTooltip';

describe('CustomTooltip Component', () => {
  it('renders custom tooltip', () => {
    // render component
    const result = render(
      <CustomTooltip tooltipContent="Mocked content" openOnClick={false}>
        <p>Mocked Text</p>
      </CustomTooltip>
    );
    expect(result?.container).toHaveTextContent(/Mocked Text/i);
  });

  it('toggle tooltip on hover', async () => {
    // render component
    const mockOnOpenCallback = jest.fn();
    const result = render(
      <CustomTooltip
        tooltipContent="Mocked content"
        openOnClick={false}
        onOpen={mockOnOpenCallback}
      >
        <p>Mocked Text</p>
      </CustomTooltip>
    );
    const paragraph = result.container.querySelector('p');
    await waitFor(() => {
      fireEvent.mouseOver(paragraph!);
    });
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/Mocked content/i);
    expect(mockOnOpenCallback).toBeCalledTimes(1);
  });

  it('toggle tooltip on click', async () => {
    // render component
    const result = render(
      <CustomTooltip tooltipContent="Mocked content" openOnClick={true}>
        <p>Mocked Text</p>
      </CustomTooltip>
    );
    const paragraph = result.container.querySelector('p');
    await waitFor(() => {
      fireEvent.click(paragraph!);
    });
    const tooltip = screen.queryByRole('tooltip');
    expect(tooltip!).toBeInTheDocument();
    expect(tooltip!).toHaveTextContent(/Mocked content/i);
  });
});
