import React from 'react';

import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import SmartHeader from '../SmartHeader';
import SmartHeaderCell from '../SmartHeaderCell';

describe('SmartHeader Component', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <SmartHeader>
        <SmartHeaderCell columnId={'mock-column-id'}>mock-column-label</SmartHeaderCell>
      </SmartHeader>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <SmartHeader>
          <SmartHeaderCell columnId={'mock-column-id'}>mock-column-label</SmartHeaderCell>
          <Box>Incorrect child</Box>
        </SmartHeader>
      )
    ).toThrowError('SmartHeader can have only children of type SmartHeaderCell');
  });
});
