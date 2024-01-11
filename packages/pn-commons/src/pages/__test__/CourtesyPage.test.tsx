import { vi } from 'vitest';

import { fireEvent, render } from '../../test-utils';
import CourtesyPage from '../CourtesyPage';

const mockClickFn = vi.fn();

describe('test CourtesyPage component', () => {
  it('renders the full component', () => {
    const { container } = render(
      <CourtesyPage
        title="Test title"
        subtitle="Test subtitle"
        onClick={mockClickFn}
        onClickLabel="Click label"
      />
    );

    expect(container).toHaveTextContent(/test title/i);
    expect(container).toHaveTextContent(/test subtitle/i);
  });

  it('clicks on the action button', () => {
    const { getByText } = render(
      <CourtesyPage
        title="Test title"
        subtitle="Test subtitle"
        onClick={mockClickFn}
        onClickLabel="Click label"
      />
    );
    const button = getByText('Click label');
    fireEvent.click(button);
    expect(mockClickFn).toHaveBeenCalledTimes(1);
  });
});
