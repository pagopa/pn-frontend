import { Row } from '../../../../models/PnTable';
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

describe('PnCardHeaderItem', () => {
  it('render component - left', () => {
    const { getByTestId } = render(
      <PnCardHeaderItem testId="cardHeaderLeft">
        {cardData['column-1']}
        {cardData['column-2']}
      </PnCardHeaderItem>
    );
    const cardHeaderLeft = getByTestId('cardHeaderLeft');
    expect(cardHeaderLeft).toHaveTextContent('Row 1-1Row 1-2');
  });

  it('render component - right', () => {
    const { getByTestId } = render(
      <PnCardHeaderItem position="right" testId="cardHeaderRight">
        {cardData['column-1']}
        {cardData['column-2']}
      </PnCardHeaderItem>
    );
    const cardHeaderRight = getByTestId('cardHeaderRight');
    expect(cardHeaderRight).toHaveTextContent('Row 1-1Row 1-2');
  });
});
