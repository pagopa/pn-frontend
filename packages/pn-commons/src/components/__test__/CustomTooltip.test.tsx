import React from 'react';

import { RenderResult, act, fireEvent, render, waitFor } from '../../test-utils';
import CustomTooltip from '../CustomTooltip';

describe('CustomTooltip Component', () => {
  let result: RenderResult;

  it('renders custom tooltip', async () => {
    // render component
    await act(async () => {
      result = render(
        <CustomTooltip tooltipContent="Mocked content" openOnClick={false}>
          <p>Mocked Text</p>
        </CustomTooltip>
      );
    });
    expect(result?.container).toHaveTextContent(/Mocked Text/i);
  });

  it('toggle tooltip on hover', async () => {
    // render component
    const mockOnOpenCallback = jest.fn();
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
    fireEvent.mouseOver(paragraph!);
    const tooltip = await waitFor(() => result.getByRole('tooltip'));
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/Mocked content/i);
    expect(mockOnOpenCallback).toBeCalledTimes(1);
  });

  it('toggle tooltip on click', async () => {
    // render component
    const { container, getByRole } = render(
      <CustomTooltip tooltipContent="Mocked content" openOnClick={true}>
        <p>Mocked Text</p>
      </CustomTooltip>
    );
    const paragraph = container.querySelector('p');
    fireEvent.click(paragraph!);
    const tooltip = await waitFor(() => getByRole('tooltip'));
    expect(tooltip!).toBeInTheDocument();
    expect(tooltip!).toHaveTextContent(/Mocked content/i);
  });
});
