import { fireEvent } from '@testing-library/react';

import { render } from "../../../../__test__/test-utils";
import NewNotificationCard from "../NewNotificationCard";

const mockStepBackFn = jest.fn();

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NewNotificationCard Component', () => {

  const Component = (isContinueDisabled: boolean) => <NewNotificationCard title="Mocked title" previousStepOnClick={mockStepBackFn} previousStepLabel="mock-previous-step-label" isContinueDisabled={isContinueDisabled}>Mocked content</NewNotificationCard>

  it('renders NewNotificationCard (continue disabled)', () => {
    // render component
    const result = render(Component(true));
    expect(result.container).toHaveTextContent(/Mocked title/i);
    expect(result.container).toHaveTextContent(/Mocked content/i);
    const buttons = result.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent(/mock-previous-step-label/i);
    expect(buttons[1]).toHaveTextContent(/button.continue/i);
    expect(buttons[1]).toBeDisabled();
  });

  it('renders NewNotificationCard (continue enabled)', () => {
    // render component
    const result = render(Component(false));
    const buttons = result.container.querySelectorAll('button');
    expect(buttons[1]).toBeEnabled();
  });

  it('clicks on back button', () => {
    // render component
    const result = render(Component(false));
    const buttons = result.container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    expect(mockStepBackFn).toBeCalledTimes(1);
  });
});