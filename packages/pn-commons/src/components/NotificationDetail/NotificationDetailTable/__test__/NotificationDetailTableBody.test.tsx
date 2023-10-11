import React from 'react';

import { render } from '../../../../test-utils';
import NotificationDetailTableBody from '../NotificationDetailTableBody';
import NotificationDetailTableBodyRow from '../NotificationDetailTableBodyRow';
import NotificationDetailTableCell from '../NotificationDetailTableCell';

describe('NotificationDetailTableBody', () => {
  it('render component', () => {
    const { container } = render(
      <table>
        <NotificationDetailTableBody>
          <NotificationDetailTableBodyRow>
            <NotificationDetailTableCell>Cell 1</NotificationDetailTableCell>
            <NotificationDetailTableCell>Cell 2</NotificationDetailTableCell>
          </NotificationDetailTableBodyRow>
        </NotificationDetailTableBody>
      </table>
    );
    expect(container).toHaveTextContent('Cell 1Cell 2');
  });
});
