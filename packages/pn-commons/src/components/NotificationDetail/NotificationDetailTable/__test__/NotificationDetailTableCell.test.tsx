import React from 'react';

import { render } from '../../../../test-utils';
import NotificationDetailTableCell from '../NotificationDetailTableCell';

describe('NotificationDetailTableCell', () => {
  it('render component', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <NotificationDetailTableCell>mock cell</NotificationDetailTableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent('mock cell');
  });
});
