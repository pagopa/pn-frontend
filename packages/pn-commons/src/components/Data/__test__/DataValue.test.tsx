import { vi } from 'vitest';

import { Typography } from '@mui/material';
import { render } from '@testing-library/react';

import DataValue from '../DataValue';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock MITooltip if necessary (optional, but useful if MITooltip has complex dependencies)
vi.mock('@pagopa/mui-italia', async () => {
  const original = await vi.importActual<any>('@pagopa/mui-italia');
  return {
    ...original,
    MITooltip: ({ children, title, disabled }: any) => (
      <div data-testid="mock-tooltip" data-disabled={disabled} title={title}>
        {children}
      </div>
    ),
  };
});

// Helper to simulate DOM overflow in JSDOM
const mockGlobalDimensions = (clientWidth: number, scrollWidth: number) => {
  const clientSpy = vi
    .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
    .mockReturnValue(clientWidth);
  const scrollSpy = vi
    .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
    .mockReturnValue(scrollWidth);

  return { clientSpy, scrollSpy };
};

describe('TruncatedValue Component', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders the default text correctly', () => {
    const { getByTestId } = render(<DataValue data-testid="test-val">Basic content</DataValue>);

    const element = getByTestId('test-val');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Basic content');
  });

  it('correctly applies polymorphism using slots', () => {
    const { getByTestId } = render(
      <DataValue
        slots={{ root: Typography }}
        slotProps={{ root: { variant: 'h3' } }}
        data-testid="test-val"
      >
        Value
      </DataValue>
    );

    const element = getByTestId('test-val');
    // Verify that Typography rendered an H3 element
    expect(element.tagName).toBe('H3');
  });

  it('does NOT enable the tooltip and does NOT set tabIndex if there is NO overflow - truncate mode', () => {
    // Simulate that the container is wider than the text
    const { clientSpy, scrollSpy } = mockGlobalDimensions(200, 100);

    const { getByTestId } = render(
      <DataValue data-testid="test-no-overflow" mode="truncate">
        Short Text
      </DataValue>
    );

    const element = getByTestId('test-no-overflow');

    // Assertions
    expect(element).not.toHaveAttribute('tabIndex');

    const tooltip = getByTestId('mock-tooltip');
    expect(tooltip).toHaveAttribute('data-disabled', 'true');

    clientSpy.mockRestore();
    scrollSpy.mockRestore();
  });

  it('ENABLES the tooltip and sets tabIndex=0 if there IS overflow - truncate mode', () => {
    // Simulate that the text is wider than the container (Overflow!)
    const { clientSpy, scrollSpy } = mockGlobalDimensions(100, 300);

    const { getByTestId } = render(
      <DataValue data-testid="test-overflow" mode="truncate">
        Very long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long
        text
      </DataValue>
    );

    const element = getByTestId('test-overflow');

    // Assertions
    expect(element).toHaveAttribute('tabIndex', '0'); // It should now be accessible via keyboard

    const tooltip = getByTestId('mock-tooltip');
    expect(tooltip).toHaveAttribute('data-disabled', 'false'); // The tooltip is active

    clientSpy.mockRestore();
    scrollSpy.mockRestore();
  });

  it('does NOT ENABLES the tooltip and does NOT tabIndex=0 if there IS overflow - wrap mode', () => {
    // Simulate that the text is wider than the container (Overflow!)
    const { clientSpy, scrollSpy } = mockGlobalDimensions(100, 300);

    const { getByTestId } = render(
      <DataValue data-testid="test-overflow" mode="wrap">
        Very long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long
        text
      </DataValue>
    );

    const element = getByTestId('test-overflow');

    // Assertions
    expect(element).not.toHaveAttribute('tabIndex');

    const tooltip = getByTestId('mock-tooltip');
    expect(tooltip).toHaveAttribute('data-disabled', 'true');

    clientSpy.mockRestore();
    scrollSpy.mockRestore();
  });
});
