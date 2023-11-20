import React from 'react';

import { Row } from '../../../../models';
import { render } from '../../../../test-utils';
import PnCardHeaderItem from '../PnCardHeaderItem';

type Item = {
  'column-1': string;
  'column-2': string;
};

const cardData: Row<Item> = {
  id: 'row-1',
  'column-1': 'Row 1-1',
  'column-2': 'Row 1-2',
};

describe('PnCardHeaderTitle', () => {
  it('render component - left', () => {
    const { getByTestId, queryByTestId } = render(
      <PnCardHeaderItem>
        {cardData['column-1']}
        {cardData['column-2']}
      </PnCardHeaderItem>
    );
    const cardHeaderLeft = getByTestId('cardHeaderLeft');
    const cardHeaderRight = queryByTestId('cardHeaderRight');
    expect(cardHeaderLeft).toHaveTextContent('Row 1-1Row 1-2');
    expect(cardHeaderRight).not.toBeInTheDocument();
  });

  it('render component - right', () => {
    const { getByTestId, queryByTestId } = render(
      <PnCardHeaderItem position="right">
        {cardData['column-1']}
        {cardData['column-2']}
      </PnCardHeaderItem>
    );
    const cardHeaderLeft = queryByTestId('cardHeaderLeft');
    const cardHeaderRight = getByTestId('cardHeaderRight');
    expect(cardHeaderLeft).not.toBeInTheDocument();
    expect(cardHeaderRight).toHaveTextContent('Row 1-1Row 1-2');
  });
});
