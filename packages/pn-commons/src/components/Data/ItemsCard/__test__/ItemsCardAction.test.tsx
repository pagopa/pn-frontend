import React from 'react';

import { fireEvent, render } from '../../../../test-utils';
import ItemsCardAction from '../ItemsCardAction';

describe('ItemsCardAction', () => {
  const mockActionFn = jest.fn();

  it('render component', () => {
    const { container } = render(<ItemsCardAction>Action</ItemsCardAction>);
    expect(container).toHaveTextContent('Action');
  });

  it('click action event', () => {
    const { getByTestId } = render(
      <ItemsCardAction testId="cardAction" handleOnClick={() => mockActionFn()}>
        Action
      </ItemsCardAction>
    );
    const action = getByTestId('cardAction');
    fireEvent.click(action);
    expect(mockActionFn).toBeCalledTimes(1);
  });
});
