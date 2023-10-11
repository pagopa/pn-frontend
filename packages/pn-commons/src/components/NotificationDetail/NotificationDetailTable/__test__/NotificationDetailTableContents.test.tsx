import React from 'react';

import { getByTestId, render } from '../../../../test-utils';
import NotificationDetailTableBody from '../NotificationDetailTableBody';
import NotificationDetailTableBodyRow from '../NotificationDetailTableBodyRow';
import NotificationDetailTableCell from '../NotificationDetailTableCell';
import NotificationDetailTableContents from '../NotificationDetailTableContents';

describe('NotificationDetailTableContents', () => {
  it('render component', () => {
    const { container, getByTestId } = render(
      <NotificationDetailTableContents label="mock-label">
        <NotificationDetailTableBody>
          <NotificationDetailTableBodyRow>
            <NotificationDetailTableCell>Cell 1</NotificationDetailTableCell>
            <NotificationDetailTableCell>Cell 2</NotificationDetailTableCell>
          </NotificationDetailTableBodyRow>
        </NotificationDetailTableBody>
      </NotificationDetailTableContents>
    );
    expect(container).toHaveTextContent('Cell 1Cell 2');
    const table = getByTestId('notificationDetailTable');
    expect(table).toHaveAttribute('aria-label', 'mock-label');
  });
});
