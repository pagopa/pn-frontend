import { vi } from 'vitest';

import { Box } from '@mui/material';

import { CardElement } from '../../../models/PnCard';
import { Row } from '../../../models/PnTable';
import { disableConsoleLogging, fireEvent, render, waitFor, within } from '../../../test-utils';
import PnCard from '../PnCard/PnCard';
import PnCardActions from '../PnCard/PnCardActions';
import PnCardContent from '../PnCard/PnCardContent';
import PnCardContentItem from '../PnCard/PnCardContentItem';
import PnCardHeader from '../PnCard/PnCardHeader';
import PnCardHeaderItem from '../PnCard/PnCardHeaderItem';
import PnCardsList from '../PnCardsList';

const clickActionMockFn = vi.fn();

type Item = {
  'column-1': string;
  'column-2': string;
  'column-3': string;
  'column-4': string;
};

const cardBody: Array<CardElement<Item>> = [
  { id: 'column-3', label: 'Column 3' },
  { id: 'column-4', label: 'Column 4' },
];

const cardData: Array<Row<Item>> = [
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

const RenderItemsCard: React.FC = () => (
  <PnCardsList>
    {cardData.map((data) => (
      <PnCard key={data.id} testId="cards">
        <PnCardHeader>
          <PnCardHeaderItem
            position="left"
            gridProps={{
              direction: { xs: 'row', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
            testId="cardHeaderLeft"
          >
            {data['column-1']}
          </PnCardHeaderItem>
          <PnCardHeaderItem
            position="right"
            gridProps={{
              direction: { xs: 'row', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
            testId="cardHeaderRight"
          >
            {data['column-2']}
          </PnCardHeaderItem>
        </PnCardHeader>
        <PnCardContent>
          {cardBody.map((body) => (
            <PnCardContentItem key={body.id} label={body.label} testId="cardBody">
              {data[body.id]}
            </PnCardContentItem>
          ))}
        </PnCardContent>
        <PnCardActions>
          <Box onClick={() => clickActionMockFn(data)} data-testid="mockedAction">
            Mocked action
          </Box>
        </PnCardActions>
      </PnCard>
    ))}
  </PnCardsList>
);

describe('PnCardsList Component', () => {
  disableConsoleLogging('error');

  it('renders component (with data)', () => {
    const { queryAllByTestId } = render(<RenderItemsCard />);
    const notificationsCards = queryAllByTestId('cards');
    expect(notificationsCards).toHaveLength(cardData.length);
    notificationsCards.forEach((card, index) => {
      const cardHeaderLeft = within(card).getByTestId('cardHeaderLeft');
      expect(cardHeaderLeft).toHaveTextContent(cardData[index]['column-1']);
      const cardHeaderRight = within(card).getByTestId('cardHeaderRight');
      expect(cardHeaderRight).toHaveTextContent(cardData[index]['column-2']);
      const cardBodyLabel = within(card).getAllByTestId('cardBodyLabel');
      const cardBodyValue = within(card).getAllByTestId('cardBodyValue');
      cardBodyLabel.forEach((label, j) => {
        expect(label).toHaveTextContent(cardBody[j].label);
        expect(cardBodyValue[j]).toHaveTextContent(cardData[index][cardBody[j].id]);
      });
      const cardActionsEl = within(card).getAllByTestId('mockedAction');
      expect(cardActionsEl).toHaveLength(1);
      cardActionsEl.forEach((action) => {
        expect(action).toHaveTextContent(/Mocked action/i);
      });
    });
  });

  it('clicks on action', async () => {
    const { queryAllByTestId } = render(<RenderItemsCard />);
    const cards = queryAllByTestId('cards');
    const cardActionsEl = within(cards[0]).getByTestId('mockedAction');
    fireEvent.click(cardActionsEl!);
    await waitFor(() => {
      expect(clickActionMockFn).toBeCalledTimes(1);
      expect(clickActionMockFn).toBeCalledWith(cardData[0]);
    });
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnCardsList>
          <PnCard>
            <PnCardContent>
              <PnCardContentItem label="mocked-label">mocked-value</PnCardContentItem>
            </PnCardContent>
          </PnCard>
          <Box>Incorrect child</Box>
        </PnCardsList>
      )
    ).toThrowError('PnCardsList can have only children of type PnCard');
  });
});
