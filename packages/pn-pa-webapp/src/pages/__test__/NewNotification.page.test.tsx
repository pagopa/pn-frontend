import { RenderResult } from '@testing-library/react';

import { render } from '../../__test__/test-utils';
import * as routes from '../../navigation/routes.const';
import NewNotification from '../NewNotification.page';


const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'mocked-id' }),
  useNavigate: () => mockNavigateFn,
}));

describe('NewNotification Page', () => {
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    result = render(<NewNotification />);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('renders NewNotification page', () => {
    expect(result?.container.querySelector('h4')).toHaveTextContent('Invia una nuova notifica');
  });

  test('clicks on the breadcrumb button', async () => {
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/Notifiche/i);
    expect(links![0]).toHaveAttribute('href', routes.DASHBOARD);
  });

  test('clicks on the api keys link', async () => {
    const links = result?.getAllByRole('link');
    expect(links![1]).toHaveTextContent(/Chiavi API/i);
    expect(links![1]).toHaveAttribute('href', routes.API_KEYS);
  });

});
