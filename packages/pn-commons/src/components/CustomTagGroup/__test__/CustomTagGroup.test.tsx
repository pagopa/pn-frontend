import { vi } from 'vitest';

import { Box } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';

import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import CustomTagGroup from '../CustomTagGroup';

describe('CustomTagGroup component', () => {
  const tagsArray = ['mock-tag-1', 'mock-tag-2', 'mock-tag-3', 'mock-tag-4'];
  const tags = tagsArray.map((v, i) => (
    <Box key={i}>
      <Tag value={v}></Tag>
    </Box>
  ));
  const mockCallbackFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with all tags', () => {
    const { container } = render(<CustomTagGroup>{tags}</CustomTagGroup>);
    expect(container).toHaveTextContent(new RegExp(tagsArray.join('')));
  });

  it('renders component with limited 3 tags', () => {
    const { container } = render(<CustomTagGroup visibleItems={3}>{tags}</CustomTagGroup>);
    expect(container).toHaveTextContent(new RegExp(tagsArray.slice(0, 3).join('')));
    expect(container).not.toHaveTextContent(/mock-tag-4/);
    expect(container).toHaveTextContent(/\+1/);
  });

  it('renders component with limited 3 tags, trigger tooltip and callback', async () => {
    const { container, getByTestId } = render(
      <CustomTagGroup visibleItems={3} onOpen={mockCallbackFn}>
        {tags}
      </CustomTagGroup>
    );
    expect(container).toHaveTextContent(new RegExp(tagsArray.slice(0, 3).join('')));
    expect(container).not.toHaveTextContent(/mock-tag-4/);
    expect(container).toHaveTextContent(/\+1/);
    const tooltipIndicator = getByTestId('custom-tooltip-indicator');
    fireEvent.mouseOver(tooltipIndicator);
    const tooltip = await waitFor(() => screen.getByRole('tooltip'));
    expect(tooltip).toHaveTextContent(/mock-tag-4/);
    expect(mockCallbackFn).toBeCalledTimes(1);
  });

  it('renders component with limited 3 tags with disabled tooltip, triggering mouseover should not do callback', async () => {
    const { container, getByTestId } = render(
      <CustomTagGroup visibleItems={3} onOpen={mockCallbackFn} disableTooltip>
        {tags}
      </CustomTagGroup>
    );
    expect(container).toHaveTextContent(/mock-tag-1mock-tag-2mock-tag-3/);
    expect(container).not.toHaveTextContent(/mock-tag-4/);
    expect(container).toHaveTextContent(/\+1/);
    const tooltipIndicator = getByTestId('remaining-tag-indicator');
    fireEvent.mouseOver(tooltipIndicator);
    const tooltip = await waitFor(() => screen.queryByRole('tooltip'));
    expect(tooltip).not.toBeInTheDocument();
    expect(mockCallbackFn).toBeCalledTimes(0);
  });
});
