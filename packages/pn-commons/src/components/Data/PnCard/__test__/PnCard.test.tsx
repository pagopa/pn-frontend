import React from 'react';

import { Box } from '@mui/material';

import { render } from '../../../../test-utils';
import PnCard from '../PnCard';
import PnCardActions from '../PnCardActions';
import PnCardContent from '../PnCardContent';
import PnCardContentItem from '../PnCardContentItem';
import PnCardHeader from '../PnCardHeader';
import PnCardHeaderItem from '../PnCardHeaderItem';

describe('PnCard', () => {
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
    ).toThrowError('PnCard must have one child of type PnCardContent');
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
      'PnCard must have only children of type PnCardHeader, PnCardContent and PnCardActions'
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
    ).toThrowError('PnCard must have one child of type PnCardHeader');
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
    ).toThrowError('PnCard must have one child of type PnCardActions');
  });
});
