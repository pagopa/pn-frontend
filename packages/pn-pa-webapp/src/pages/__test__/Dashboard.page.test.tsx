import { act, screen } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../__test__/test-utils';
import { tenYearsAgo, today } from '../../utils/date.utility';
import Dashboard from '../Dashboard.page';

describe('Dashboard Page', () => {
  it('renders dashboard page', async () => {
    const spy = jest.spyOn(redux, 'useSelector');
    spy.mockReturnValue({
      notifications: [],
      pagination: {
        nextPagesKey: ['1'],
        size: 0,
        page: 0,
        moreResult: false,
      },
      filters: {
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        recipientId: '',
        status: '',
        subjectRegExp: '',
      },
      sort: {
        orderBy: '',
        order: 'asc'
     }
    });

    await act( async () => {
      render(<Dashboard/>);
      expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
      spy.mockClear();
    });    
  });
});
