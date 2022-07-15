import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import LoginError from '../LoginError';
import { ROUTE_LOGIN } from '../../../utils/constants';
import '../../../locales/i18n';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

test.skip('test login error', async () => {
  render(
    <BrowserRouter>
      <LoginError />
    </BrowserRouter>
  );

  screen.getByText('Spiacenti, qualcosa è andato storto.');
  screen.getByText('A causa di un errore del sistema non è possibile completare la procedura.', {
    exact: false,
  });
  screen.getByText('Ti chiediamo di riprovare più tardi.', {
    exact: false,
  });

  await waitFor(
    () => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(ROUTE_LOGIN);
    },
    {
      timeout: 3000,
    }
  );
});
