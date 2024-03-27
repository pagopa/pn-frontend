import React from 'react';

import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import PnCardContent from '../PnCardContent';
import PnCardContentItem from '../PnCardContentItem';

describe('PnCardContent', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnCardContent>
        <PnCardContentItem label="mocked-card-label-1">mocked-card-content-1</PnCardContentItem>
        <PnCardContentItem label="mocked-card-label-2">mocked-card-content-2</PnCardContentItem>
        <PnCardContentItem label="mocked-card-label-3">mocked-card-content-3</PnCardContentItem>
      </PnCardContent>
    );
    expect(container).toHaveTextContent('mocked-card-label-1mocked-card-content-1');
    expect(container).toHaveTextContent('mocked-card-label-2mocked-card-content-2');
    expect(container).toHaveTextContent('mocked-card-label-3mocked-card-content-3');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnCardContent>
          <PnCardContentItem label="mocked-card-label-1">mocked-card-content-1</PnCardContentItem>
          <PnCardContentItem label="mocked-card-label-2">mocked-card-content-2</PnCardContentItem>
          <PnCardContentItem label="mocked-card-label-3">mocked-card-content-3</PnCardContentItem>
          <Box>Incorrect child</Box>
        </PnCardContent>
      )
    ).toThrowError('PnCardContent can have only children of type PnCardContentItem');
  });
});
