import { vi } from 'vitest';

import { RenderResult, act, fireEvent, render, waitFor } from '../../test-utils';
import CustomTooltip from '../CustomTooltip';

describe('CustomTooltip Component', () => {
  let result: RenderResult;

  it('renders custom tooltip', async () => {
    // render component
    await act(async () => {
      result = render(
        <CustomTooltip tooltipContent="Mocked content" openOnClick={false}>
          <p >Mocked Text</p>
        </CustomTooltip>
      );
    });
    expect(result?.container).toHaveTextContent(/Mocked Text/i);
  });

  it('toggle tooltip on hover', async () => {
    // render component
    const mockOnOpenCallback = vi.fn();
    await act(async () => {
      result = render(
        <CustomTooltip
          tooltipContent="Mocked content"
          openOnClick={false}
          onOpen={mockOnOpenCallback}
        >
          <p data-testid="testTooltipText">Mocked Text</p>       
        </CustomTooltip>
      );
    });
    const paragraph = result.getByTestId('testTooltipText');
    // first check that click doesn't work
    fireEvent.click(paragraph!);
    let tooltip = await waitFor(() => result.queryByRole('tooltip'));
    expect(tooltip).not.toBeInTheDocument();
    // check hover
    fireEvent.mouseOver(paragraph!);
    tooltip = await waitFor(() => result.getByRole('tooltip'));
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/Mocked content/i);
    expect(mockOnOpenCallback).toBeCalledTimes(1);
    // again check that click doesn't work
    fireEvent.click(paragraph!);
    await waitFor(() => {
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('toggle tooltip on click', async () => {
    // render component
    const { container, getByRole } = render(
      <CustomTooltip tooltipContent="Mocked content" openOnClick={true}>
        <p>Mocked Text</p>     
       </CustomTooltip>
    );
    const paragraph = container.querySelector('p');
    // open tooltip
    fireEvent.click(paragraph!);
    const tooltip = await waitFor(() => getByRole('tooltip'));
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/Mocked content/i);
    // close tooltip
    fireEvent.click(paragraph!);
    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument();
    });
  });
});
