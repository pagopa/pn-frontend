import { vi } from 'vitest';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import AppNotAccessible from '../AppNotAccessible';

describe('AppNotAccessible Component', () => {
  const actionHandlerMk = vi.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    actionHandlerMk.mockClear();
  });

  it('renders default "not-accessible" variant', () => {
    const { container, getByTestId } = render(<AppNotAccessible onAction={actionHandlerMk} />);

    expect(container).toHaveTextContent('common - not-accessible.title');
    expect(container).toHaveTextContent('common - not-accessible.description');

    const landingLink = getByTestId('goToLanding-link');
    fireEvent.click(landingLink);
    expect(actionHandlerMk).toHaveBeenCalledTimes(1);
  });

  it('renders "user-validation-failed" variant', () => {
    const { container, getByTestId } = render(
      <AppNotAccessible onAction={actionHandlerMk} reason="user-validation-failed" />
    );

    expect(container).toHaveTextContent('common - user-validation-failed.title');
    expect(container).toHaveTextContent('common - user-validation-failed.description');

    const feedbackButton = getByTestId('feedback-button');
    fireEvent.click(feedbackButton);
    expect(actionHandlerMk).toHaveBeenCalledTimes(1);
  });
});
