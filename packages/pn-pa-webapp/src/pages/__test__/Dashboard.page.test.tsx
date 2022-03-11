import { act, screen } from '@testing-library/react';
import { tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import * as hooks from '../../redux/hooks';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import Dashboard from '../Dashboard.page';

describe('Dashboard Page', () => {
  beforeEach(async () => {
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce(notificationsToFe.result)
      .mockReturnValueOnce({
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        recipientId: '',
        status: '',
        subjectRegExp: '',
      })
      .mockReturnValueOnce({
        orderBy: '',
        order: 'asc',
      })
      .mockReturnValueOnce({
        nextPagesKey: [],
        size: 10,
        page: 0,
        moreResult: false,
      });
    // render component
    await act(async () => {
      render(<Dashboard />);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders dashboard page', () => {
    expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
  });
});
