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
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttons[1]).toHaveTextContent(/mock-previous-step-label/i);
    expect(buttons[0]).toHaveTextContent(/button.continue/i);
    expect(buttons[0]).toBeDisabled();
  });

  it('renders NewNotificationCard (continue enabled)', () => {
    // render component
    const result = render(Component(false));
    const buttons = result.container.querySelectorAll('button');
    expect(buttons[0]).toBeEnabled();
  });

  it('clicks on back button', () => {
    // render component
    const result = render(Component(false));
    const buttons = result.container.querySelectorAll('button');
    fireEvent.click(buttons[1]);
    expect(mockStepBackFn).toBeCalledTimes(1);
  });
});