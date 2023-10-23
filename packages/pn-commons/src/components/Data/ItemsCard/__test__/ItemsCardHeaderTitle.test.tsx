import React from 'react';

import { CardElement, Item } from '../../../../models';
import { render } from '../../../../test-utils';
import ItemsCardHeaderTitle from '../ItemsCardHeaderTitle';

const cardHeader: [CardElement, CardElement] = [
  { id: 'column-1', label: 'Column 1', getLabel: (value: string) => value },
  { id: 'column-2', label: 'Column 2', getLabel: (value: string) => value },
];

const cardData: Item = {
  id: 'row-1',
  'column-1': 'Row 1-1',
  'column-2': 'Row 1-2',
};

describe('ItemsCardHeaderTitle', () => {
  it('render component', () => {
    const { container } = render(
      <ItemsCardHeaderTitle item={cardData} cardHeader={cardHeader}></ItemsCardHeaderTitle>
    );
    expect(container).toHaveTextContent('Row 1-1Row 1-2');
  });
});
