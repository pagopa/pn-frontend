import React from 'react';

import { fireEvent, render } from '../../../../__test__/test-utils';
import NewNotificationCard from '../NewNotificationCard';

const mockStepBackFn = jest.fn();

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NewNotificationCard Component', () => {
  it('renders NewNotificationCard (no title and no subtitle)', () => {
    // render component
    const { queryByTestId } = render(
      <NewNotificationCard
        previousStepOnClick={mockStepBackFn}
        submitLabel="mock-submit-label"
        isContinueDisabled={false}
      >
        Mocked content
      </NewNotificationCard>
    );
    const title = queryByTestId('title');
    expect(title).not.toBeInTheDocument();
    const subtitle = queryByTestId('subtitle');
    expect(subtitle).not.toBeInTheDocument();
  });

  it('renders NewNotificationCard (continue disabled)', () => {
    // render component
    const { container, getByTestId } = render(
      <NewNotificationCard
        title="Mocked title"
        subtitle="Mocked subtitle"
        previousStepOnClick={mockStepBackFn}
        previousStepLabel="mock-previous-step-label"
        isContinueDisabled
      >
        Mocked content
      </NewNotificationCard>
    );
    expect(container).toHaveTextContent(/Mocked title/i);
    expect(container).toHaveTextContent(/Mocked subtitle/i);
    expect(container).toHaveTextContent(/Mocked content/i);
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toHaveTextContent(/button.continue/i);
    expect(submitButton).toBeDisabled();
    const previousButton = getByTestId('previous-step');
    expect(previousButton).toHaveTextContent(/mock-previous-step-label/i);
  });

  it('renders NewNotificationCard (continue enabled)', () => {
    // render component
    const { getByTestId } = render(
      <NewNotificationCard
        title="Mocked title"
        previousStepOnClick={mockStepBackFn}
        previousStepLabel="mock-previous-step-label"
        isContinueDisabled={false}
      >
        Mocked content
      </NewNotificationCard>
    );
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
  });

  it('renders NewNotificationCard (continue custom label)', () => {
    // render component
    const { getByTestId } = render(
      <NewNotificationCard
        title="Mocked title"
        previousStepOnClick={mockStepBackFn}
        previousStepLabel="mock-previous-step-label"
        submitLabel="mock-submit-label"
        isContinueDisabled={false}
      >
        Mocked content
      </NewNotificationCard>
    );
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toHaveTextContent(/mock-submit-label/i);
  });

  it('renders NewNotificationCard (no previous button)', () => {
    // render component
    const { queryByTestId } = render(
      <NewNotificationCard
        title="Mocked title"
        previousStepOnClick={mockStepBackFn}
        submitLabel="mock-submit-label"
        isContinueDisabled={false}
      >
        Mocked content
      </NewNotificationCard>
    );
    const previousButton = queryByTestId('previous-step');
    expect(previousButton).not.toBeInTheDocument();
  });

  it('clicks on back button', () => {
    // render component
    const { getByTestId } = render(
      <NewNotificationCard
        title="Mocked title"
        previousStepOnClick={mockStepBackFn}
        previousStepLabel="mock-previous-step-label"
        isContinueDisabled={false}
      >
        Mocked content
      </NewNotificationCard>
    );
    const previousButton = getByTestId('previous-step');
    fireEvent.click(previousButton);
    expect(mockStepBackFn).toBeCalledTimes(1);
  });
});
