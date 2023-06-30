import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Logout from '../Logout';
import { storageOnSuccessOps } from '../../../utils/storage';
import { getConfiguration } from "../../../services/configuration.service";

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

test('test logout', () => {
  storageOnSuccessOps.write('ON_SUCCESS');

  render(
    <BrowserRouter>
      <Logout />
    </BrowserRouter>
  );

  expect(storageOnSuccessOps.read()).toBeUndefined();

  expect(mockNavigateFn).toBeCalledTimes(1);
  expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
});
