import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Logout from '../Logout';
import { ROUTE_LOGIN } from '../../../utils/constants';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

test('test logout', () => {
  render(
    <BrowserRouter>
      <Logout />
    </BrowserRouter>
  );

  expect(mockNavigateFn).toBeCalledTimes(1);
  expect(mockNavigateFn).toBeCalledWith(ROUTE_LOGIN);
});
