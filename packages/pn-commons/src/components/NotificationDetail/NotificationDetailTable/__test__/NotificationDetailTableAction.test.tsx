import React from 'react';

import { Button } from '@mui/material';

import { fireEvent, render } from '../../../../test-utils';
import NotificationDetailTableAction from '../NotificationDetailTableAction';

describe('NotificationDetailTableAction', () => {
  const mockActionFn = jest.fn();
  it('render component and click event', () => {
    const { getByTestId, container } = render(
      <NotificationDetailTableAction>
        <Button data-testid="button" onClick={() => mockActionFn()}>
          mock-action-button
        </Button>
      </NotificationDetailTableAction>
    );
    expect(container).toHaveTextContent('mock-action-button');
    const button = getByTestId('button');
    fireEvent.click(button);
    expect(mockActionFn).toBeCalledTimes(1);
  });
});
