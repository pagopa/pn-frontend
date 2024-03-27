import React from 'react';

import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import SmartBodyCell from '../SmartBodyCell';
import SmartBodyRow from '../SmartBodyRow';

describe('SmartBodyRow', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <SmartBodyRow index={1}>
        <SmartBodyCell columnId={'mock-column-id'} tableProps={{}}>
          mocked-cell-content
        </SmartBodyCell>
      </SmartBodyRow>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <SmartBodyRow index={1}>
          <SmartBodyCell columnId={'mock-column-id'} tableProps={{}}>
            mocked-cell-content
          </SmartBodyCell>
          <Box>Incorrect child</Box>
        </SmartBodyRow>
      )
    ).toThrowError(
      'SmartBodyRow can have only children of type SmartBodyCell and 1 child of type SmartActions'
    );
  });
});
