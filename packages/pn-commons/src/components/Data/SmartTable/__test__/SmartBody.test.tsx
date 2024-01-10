import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import SmartBody from '../SmartBody';
import SmartBodyCell from '../SmartBodyCell';
import SmartBodyRow from '../SmartBodyRow';

describe('SmartBody', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <SmartBody>
        <SmartBodyRow index={1}>
          <SmartBodyCell columnId={'mock-column-id'} tableProps={{}}>
            mocked-cell-content
          </SmartBodyCell>
        </SmartBodyRow>
      </SmartBody>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <SmartBody>
          <SmartBodyRow index={1}>
            <SmartBodyCell columnId={'mock-column-id'} tableProps={{}}>
              mocked-cell-content
            </SmartBodyCell>
          </SmartBodyRow>
          <Box>Incorrect child</Box>
        </SmartBody>
      )
    ).toThrowError('SmartBody can have only children of type SmartBodyRow');
  });
});
