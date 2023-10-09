import React from 'react';

import { fireEvent, render, waitFor, within } from '../../../test-utils';
import { CardAction, CardElement, Item } from '../../../types';
import ItemsCard from '../ItemsCard';
import ItemsCardAction from '../ItemsCard/ItemsCardAction';
import ItemsCardActions from '../ItemsCard/ItemsCardActions';
import ItemsCardBody from '../ItemsCard/ItemsCardBody';
import ItemsCardContent from '../ItemsCard/ItemsCardContent';
import ItemsCardContents from '../ItemsCard/ItemsCardContents';
import ItemsCardHeader from '../ItemsCard/ItemsCardHeader';
import ItemsCardHeaderTitle from '../ItemsCard/ItemsCardHeaderTitle';

const clickActionMockFn = jest.fn();

const cardHeader: [CardElement, CardElement] = [
  { id: 'column-1', label: 'Column 1', getLabel: (value: string) => value },
  { id: 'column-2', label: 'Column 2', getLabel: (value: string) => value },
];

const cardBody: Array<CardElement> = [
  { id: 'column-3', label: 'Column 3', getLabel: (value: string) => value },
  { id: 'column-4', label: 'Column 4', getLabel: (value: string) => value },
];

const cardData: Array<Item> = [
  {
    id: 'row-1',
    'column-1': 'Row 1-1',
    'column-2': 'Row 1-2',
    'column-3': 'Row 1-3',
    'column-4': 'Row 1-4',
  },
  {
    id: 'row-2',
    'column-1': 'Row 2-1',
    'column-2': 'Row 2-2',
    'column-3': 'Row 2-3',
    'column-4': 'Row 2-4',
  },
  {
    id: 'row-3',
    'column-1': 'Row 3-1',
    'column-2': 'Row 3-2',
    'column-3': 'Row 3-3',
    'column-4': 'Row 3-4',
  },
];

const cardActions: Array<CardAction> = [
  { id: 'action-1', component: <div>Mocked action</div>, onClick: clickActionMockFn },
];

const RenderItemsCard: React.FC = () => (
  <ItemsCard>
    {cardData.map((data) => (
      <ItemsCardBody key={data.id} testId="itemCard">
        <ItemsCardHeader>
          <ItemsCardHeaderTitle
            cardHeader={cardHeader}
            item={data}
            headerGridProps={{
              direction: { xs: 'row', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          />
        </ItemsCardHeader>
        <ItemsCardContents>
          {cardBody.map((body) => (
            <ItemsCardContent key={body.id} body={body}>
              {body.getLabel(data[body.id], data)}
            </ItemsCardContent>
          ))}
        </ItemsCardContents>
        <ItemsCardActions>
          {cardActions &&
            cardActions.map((action) => (
              <ItemsCardAction
                testId="cardAction"
                key={action.id}
                handleOnClick={() => action.onClick(data)}
              >
                {action.component}
              </ItemsCardAction>
            ))}
        </ItemsCardActions>
      </ItemsCardBody>
    ))}
  </ItemsCard>
);

describe('Items Card Component', () => {
  it('renders component (with data)', () => {
    const { queryAllByTestId } = render(<RenderItemsCard />);
    const notificationsCards = queryAllByTestId('itemCard');
    expect(notificationsCards).toHaveLength(cardData.length);
    notificationsCards.forEach((card, index) => {
      const cardHeaderLeft = within(card).getByTestId('cardHeaderLeft');
      expect(cardHeaderLeft).toHaveTextContent(cardData[index][cardHeader[0].id].toString());
      const cardHeaderRight = within(card).getByTestId('cardHeaderRight');
      expect(cardHeaderRight).toHaveTextContent(cardData[index][cardHeader[1].id].toString());
      const cardBodyLabel = within(card).getAllByTestId('cardBodyLabel');
      const cardBodyValue = within(card).getAllByTestId('cardBodyValue');
      cardBodyLabel.forEach((label, j) => {
        expect(label).toHaveTextContent(cardBody[j].label);
        expect(cardBodyValue[j]).toHaveTextContent(cardData[index][cardBody[j].id].toString());
      });
      const cardActionsEl = within(card).getAllByTestId('cardAction');
      expect(cardActionsEl).toHaveLength(cardActions.length);
      cardActionsEl.forEach((action) => {
        expect(action).toHaveTextContent(/Mocked action/i);
      });
    });
  });

  it('clicks on action', async () => {
    const { queryAllByTestId } = render(<RenderItemsCard />);
    const notificationsCards = queryAllByTestId('itemCard');
    const cardActionsEl = within(notificationsCards[0]).getByTestId('cardAction');
    fireEvent.click(cardActionsEl!);
    await waitFor(() => {
      expect(clickActionMockFn).toBeCalledTimes(1);
      expect(clickActionMockFn).toBeCalledWith(cardData[0]);
    });
  });
});
