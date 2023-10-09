import React from 'react';

import { render } from '../../../../test-utils';
import ItemsCardAction from '../ItemsCardAction';
import ItemsCardActions from '../ItemsCardActions';

describe('ItemsCardActions', () => {
  it('render component', () => {
    const { container } = render(
      <ItemsCardActions>
        <ItemsCardAction>Action 1</ItemsCardAction>
        <ItemsCardAction>Action 2</ItemsCardAction>
        <ItemsCardAction>Action 3</ItemsCardAction>
      </ItemsCardActions>
    );
    expect(container).toHaveTextContent('Action 1Action 2Action 3');
  });
});
