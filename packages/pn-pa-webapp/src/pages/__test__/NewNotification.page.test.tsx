import { fireEvent, RenderResult, waitFor } from '@testing-library/react';

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
jest.mock(
  '../components/NewNotification/PreliminaryInformations',
  () =>
    ({ onConfirm }: { onConfirm: () => void }) =>
      (
        <div data-testid="stepContent">
          PreliminaryInformations <button onClick={onConfirm}>Click Me!</button>
        </div>
      )
);
jest.mock(
  '../components/NewNotification/Recipient',
  () =>
    ({ onConfirm }: { onConfirm: () => void }) =>
      (
        <div data-testid="stepContent">
          Recipient <button onClick={onConfirm}>Click Me!</button>
        </div>
      )
);
jest.mock(
  '../components/NewNotification/Attachments',
  () =>
    ({ onConfirm }: { onConfirm: () => void }) =>
      (
        <div data-testid="stepContent">
          Attachments <button onClick={onConfirm}>Click Me!</button>
        </div>
      )
);
jest.mock(
  '../components/NewNotification/PaymentMethods',
  () =>
    ({ onConfirm }: { onConfirm: () => void }) =>
      (
        <div data-testid="stepContent">
          PaymentMethods <button onClick={onConfirm}>Click Me!</button>
        </div>
      )
);

describe('NewNotification Page', () => {
  let result: RenderResult | undefined;

  async function testNavigation(currentStepText: string, nextStepText: string) {
    const currentStepContent = result?.queryByTestId('stepContent');
    expect(currentStepContent).toHaveTextContent(currentStepText);
    const button = currentStepContent?.querySelector('button');
    fireEvent.click(button!);
    await waitFor(() => {
      const nextStepContent = result?.queryByTestId('stepContent');
      expect(nextStepContent).toHaveTextContent(nextStepText);
    });
  }

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
    const stepContent = result?.queryByTestId('stepContent');
    expect(stepContent).toHaveTextContent(/PreliminaryInformations/i);
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

  test('tests step navigation', async () => {
    await testNavigation('PreliminaryInformations', 'Recipient');
    await testNavigation('Recipient', 'Attachments');
    await testNavigation('Attachments', 'PaymentMethods');
  });
});
