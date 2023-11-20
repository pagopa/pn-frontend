import React from 'react';

import { Box } from '@mui/material';

import { Row } from '../../../../models';
import { render } from '../../../../test-utils';
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

  it('render component - no resulting child', () => {
    expect(() =>
      render(
        <PnCardHeader>
          <Box>Incorrect child</Box>
        </PnCardHeader>
      )
    ).toThrowError('PnCardHeader must have at least one child');
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
    ).toThrowError('PnCardHeader must have only children of type PnCardHeaderItem');
  });

  it('render component - too much children', () => {
    expect(() =>
      render(
        <PnCardHeader>
          <PnCardHeaderItem>
            <Box>{cardData['column-1']}</Box>
            <Box>{cardData['column-2']}</Box>
          </PnCardHeaderItem>
          <PnCardHeaderItem>
            <Box>{cardData['column-1']}</Box>
            <Box>{cardData['column-2']}</Box>
          </PnCardHeaderItem>
          <PnCardHeaderItem>
            <Box>{cardData['column-1']}</Box>
            <Box>{cardData['column-2']}</Box>
          </PnCardHeaderItem>
        </PnCardHeader>
      )
    ).toThrowError('PnCardHeader must have a maximum of two children');
  });
});
