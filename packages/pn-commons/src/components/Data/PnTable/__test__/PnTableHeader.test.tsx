import React from 'react';

import { Box } from '@mui/material';

import { render } from '../../../../test-utils';
import PnTableHeader from '../PnTableHeader';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  it('render component', () => {
    const { container } = render(
      <PnTableHeader>
        <PnTableHeaderCell columnId={'mock-column-id'}>mock-column-label</PnTableHeaderCell>
      </PnTableHeader>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });

  it('render component - no resulting child', () => {
    expect(() =>
      render(
        <PnTableHeader>
          <Box>Incorrect child</Box>
        </PnTableHeader>
      )
    ).toThrowError('PnTableHeader must have at least one child');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnTableHeader>
          <PnTableHeaderCell columnId={'mock-column-id'}>mock-column-label</PnTableHeaderCell>
          <Box>Incorrect child</Box>
        </PnTableHeader>
      )
    ).toThrowError('PnTableHeader must have only children of type PnTableHeaderCell');
  });
});
