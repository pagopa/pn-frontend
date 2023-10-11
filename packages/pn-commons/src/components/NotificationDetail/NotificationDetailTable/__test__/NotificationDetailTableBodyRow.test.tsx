import React from 'react';

import { render } from '../../../../test-utils';
import NotificationDetailTableBodyRow from '../NotificationDetailTableBodyRow';
import NotificationDetailTableCell from '../NotificationDetailTableCell';

describe('NotificationDetailTableBodyRow', () => {
  it('render component', () => {
    const { container } = render(
      <table>
        <tbody>
          <NotificationDetailTableBodyRow>
            <NotificationDetailTableCell>Cell 1</NotificationDetailTableCell>
            <NotificationDetailTableCell>Cell 2</NotificationDetailTableCell>
          </NotificationDetailTableBodyRow>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent('Cell 1Cell 2');
  });
});
