import React from 'react';

import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import PnCard from '../PnCard';
import PnCardActions from '../PnCardActions';
import PnCardContent from '../PnCardContent';
import PnCardContentItem from '../PnCardContentItem';
import PnCardHeader from '../PnCardHeader';
import PnCardHeaderItem from '../PnCardHeaderItem';

describe('PnCard', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnCard>
        <PnCardContent>
          <PnCardContentItem label="mock-card-label">mock-card-body</PnCardContentItem>
        </PnCardContent>
      </PnCard>
    );
    expect(container).toHaveTextContent('mock-card-labelmock-card-body');
  });

  it('render component - no PnContent child', () => {
    expect(() =>
      render(
        <PnCard>
          <PnCardHeader>
            <PnCardHeaderItem>Header</PnCardHeaderItem>
          </PnCardHeader>
          <PnCardActions>Action</PnCardActions>
        </PnCard>
      )
    ).toThrowError('PnCard can have only 1 child of type PnCardContent');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnCard>
          <PnCardHeader>
            <PnCardHeaderItem>Header</PnCardHeaderItem>
          </PnCardHeader>
          <PnCardContent>
            <PnCardContentItem label="mock-card-label">mock-card-body</PnCardContentItem>
          </PnCardContent>
          <Box>Incorrect child</Box>
        </PnCard>
      )
    ).toThrowError(
      'PnCard can have only 1 child of type PnCardHeader, 1 child of type PnCardContent and 1 child of type PnCardActions'
    );
  });

  it('render component - more than one PnCardHeader', () => {
    expect(() =>
      render(
        <PnCard>
          <PnCardHeader>
            <PnCardHeaderItem>Header</PnCardHeaderItem>
          </PnCardHeader>
          <PnCardHeader>
            <PnCardHeaderItem>Header</PnCardHeaderItem>
          </PnCardHeader>
          <PnCardContent>
            <PnCardContentItem label="mock-card-label">mock-card-body</PnCardContentItem>
          </PnCardContent>
        </PnCard>
      )
    ).toThrowError('PnCard can have only 1 child of type PnCardHeader');
  });

  it('render component - more than one PnCardActions', () => {
    expect(() =>
      render(
        <PnCard>
          <PnCardContent>
            <PnCardContentItem label="mock-card-label">mock-card-body</PnCardContentItem>
          </PnCardContent>
          <PnCardActions>Action</PnCardActions>
          <PnCardActions>Action</PnCardActions>
        </PnCard>
      )
    ).toThrowError('PnCard can have only 1 child of type PnCardActions');
  });
});
