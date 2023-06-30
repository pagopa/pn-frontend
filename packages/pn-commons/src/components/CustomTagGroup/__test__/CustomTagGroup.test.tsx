import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { Box } from '@mui/material';
import CustomTagGroup from '../CustomTagGroup';

describe('CustomTagGroup component', () => {
  const tagsArray = ['mock-tag-1', 'mock-tag-2', 'mock-tag-3', 'mock-tag-4'];
  const tags = tagsArray.map((v, i) => <Box key={i}>{v}</Box>);
  const mockCallbackFn = jest.fn();

  it('renders component with all tags', () => {
    const result = render(<CustomTagGroup>{tags}</CustomTagGroup>);
    expect(result.container).toHaveTextContent(/mock-tag-1mock-tag-2mock-tag-3mock-tag-4/);
  });

  it('renders component with limited 3 tags', () => {
    const result = render(<CustomTagGroup visibleItems={3}>{tags}</CustomTagGroup>);
    expect(result.container).toHaveTextContent(/mock-tag-1mock-tag-2mock-tag-3/);
    expect(result.container).not.toHaveTextContent(/mock-tag-4/);
    expect(result.container).toHaveTextContent(/\+1/);
  });

  it('renders component with limited 3 tags, trigger tooltip and callback', async () => {
    const result = render(
      <CustomTagGroup visibleItems={3} onOpen={mockCallbackFn}>
        {tags}
      </CustomTagGroup>
    );
    expect(result.container).toHaveTextContent(/mock-tag-1mock-tag-2mock-tag-3/);
    expect(result.container).not.toHaveTextContent(/mock-tag-4/);
    expect(result.container).toHaveTextContent(/\+1/);
    const tooltip = screen.getByTestId('custom-tooltip-indicator');
    fireEvent.mouseOver(tooltip);
    await waitFor(async () => expect(screen.getAllByText(/mock-tag-4/)[0]).toBeInTheDocument());
    expect(mockCallbackFn).toBeCalledTimes(1);
  });

  it('renders component with limited 3 tags with disabled tooltip, triggering mouseover should not do callback', async () => {
    const result = render(
      <CustomTagGroup visibleItems={3} onOpen={mockCallbackFn} disableTooltip>
        {tags}
      </CustomTagGroup>
    );
    expect(result.container).toHaveTextContent(/mock-tag-1mock-tag-2mock-tag-3/);
    expect(result.container).not.toHaveTextContent(/mock-tag-4/);
    expect(result.container).toHaveTextContent(/\+1/);
    const tooltip = screen.getByTestId('remaining-tag-indicator');
    await waitFor(async () => fireEvent.mouseOver(tooltip));
    expect(mockCallbackFn).toBeCalledTimes(0);
  });
});
