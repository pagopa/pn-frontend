import React from 'react';

import { fireEvent, render } from '../../test-utils';
import CourtesyPage from '../CourtesyPage';

const mockClickFn = jest.fn();

describe('test CourtesyPage component', () => {
  it('renders the full component', () => {
    const result = render(
      <CourtesyPage
        title="Test title"
        subtitle="Test subtitle"
        onClick={mockClickFn}
        onClickLabel="Click label"
      />
    );

    expect(result.container).toHaveTextContent(/test title/i);
    expect(result.container).toHaveTextContent(/test subtitle/i);
  });

  it('clicks on the action button', () => {
    const result = render(
      <CourtesyPage
        title="Test title"
        subtitle="Test subtitle"
        onClick={mockClickFn}
        onClickLabel="Click label"
      />
    );
    const button = result.getByText('Click label');

    fireEvent.click(button);
    expect(mockClickFn).toHaveBeenCalledTimes(1);
  });
});
