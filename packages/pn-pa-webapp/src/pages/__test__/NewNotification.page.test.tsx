import React from 'react';
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

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
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

// Before the update, tests completed with success but in console there were a lot of warnings due to the forwardRef feature.
// Because we mock the component and trhe real component export its ref,
// also the mocked component must have the forwardRef and the useImperativeHandle features.
// Furthermore the useImperativeHandle in the mocked component must export the same elements that the real component does
// ----------------------
// Andrea Cimini, 2023.02.17
jest.mock('../components/NewNotification/Recipient', () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual('react');
  return forwardRef(({ onConfirm }: { onConfirm: () => void }, ref: any) => {
    useImperativeHandle(ref, () => ({
      confirm: () => {},
    }));
    return (
      <div data-testid="stepContent">
        Recipient <button onClick={onConfirm}>Click Me!</button>
      </div>
    );
  });
});

jest.mock('../components/NewNotification/Attachments', () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual('react');
  return forwardRef(({ onConfirm }: { onConfirm: () => void }, ref: any) => {
    useImperativeHandle(ref, () => ({
      confirm: () => {},
    }));
    return (
      <div data-testid="stepContent">
        Attachments <button onClick={onConfirm}>Click Me!</button>
      </div>
    );
  });
});

jest.mock('../components/NewNotification/PaymentMethods', () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual('react');
  return forwardRef(({ onConfirm }: { onConfirm: () => void }, ref: any) => {
    useImperativeHandle(ref, () => ({
      confirm: () => {},
    }));
    return (
      <div data-testid="stepContent">
        PaymentMethods <button onClick={onConfirm}>Click Me!</button>
      </div>
    );
  });
});

jest.mock('../components/NewNotification/SyncFeedback', () => () => (
  <div data-testid="stepContent">SyncFeedback</div>
));
const mockIsPaymentEnabledGetter = jest.fn();
jest.mock('../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});


describe('NewNotification Page with payment', () => {
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
    mockIsPaymentEnabledGetter.mockReturnValue(true);

    result = render(<NewNotification />);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('renders NewNotification page', () => {
    expect(result?.container.querySelector('h4')).toHaveTextContent('new-notification.title');
    const stepContent = result?.queryByTestId('stepContent');
    expect(stepContent).toHaveTextContent(/PreliminaryInformations/i);
  });

  test('clicks on the breadcrumb button', async () => {
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/new-notification.breadcrumb-root/i);
    expect(links![0]).toHaveAttribute('href', routes.DASHBOARD);
  });

  /*
  PN-2028
  test('clicks on the api keys link', async () => {
    const links = result?.getAllByRole('link');
    expect(links![1]).toHaveTextContent(/menu.api-key/i);
    expect(links![1]).toHaveAttribute('href', routes.API_KEYS);
  });
  */

  test('tests step navigation', async () => {
    await testNavigation('PreliminaryInformations', 'Recipient');
    await testNavigation('Recipient', 'Attachments');
    await testNavigation('Attachments', 'PaymentMethods');
  });
});

describe('NewNotification Page without payment', () => {
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
    mockIsPaymentEnabledGetter.mockReturnValue(false);

    result = render(<NewNotification />);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('renders NewNotification page', () => {
    expect(result?.container.querySelector('h4')).toHaveTextContent('new-notification.title');
    const stepContent = result?.queryByTestId('stepContent');
    expect(stepContent).toHaveTextContent(/PreliminaryInformations/i);
  });

  test('clicks on the breadcrumb button', async () => {
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/new-notification.breadcrumb-root/i);
    expect(links![0]).toHaveAttribute('href', routes.DASHBOARD);
  });

  test('render alert', () => {
    const alert = result?.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('new-notification.warning-payment-disabled');
  });

  /*
  PN-2028
  test('clicks on the api keys link', async () => {
    const links = result?.getAllByRole('link');
    expect(links![1]).toHaveTextContent(/menu.api-key/i);
    expect(links![1]).toHaveAttribute('href', routes.API_KEYS);
  });
  */

  test('tests step navigation', async () => {
    await testNavigation('PreliminaryInformations', 'Recipient');
    await testNavigation('Recipient', 'Attachments');
    //await testNavigation('Attachments', 'PaymentMethods');
  });
});
