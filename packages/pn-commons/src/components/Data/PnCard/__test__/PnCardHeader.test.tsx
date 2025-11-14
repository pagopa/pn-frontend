import { Box } from '@mui/material';

import { Row } from '../../../../models/PnTable';
import { disableConsoleLogging, render } from '../../../../test-utils';
import PnCardHeader from '../PnCardHeader';
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

describe('PnCardHeader', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnCardHeader>
        <PnCardHeaderItem>
          <Box>{cardData['column-1']}</Box>
          <Box>{cardData['column-2']}</Box>
        </PnCardHeaderItem>
      </PnCardHeader>
    );
    expect(container).toHaveTextContent('Row 1-1Row 1-2');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnCardHeader>
          <PnCardHeaderItem>
            <Box>{cardData['column-1']}</Box>
            <Box>{cardData['column-2']}</Box>
          </PnCardHeaderItem>
          <Box>Incorrect child</Box>
        </PnCardHeader>
      )
    ).toThrowError('PnCardHeader can have only children of type PnCardHeaderItem');
  });
});
