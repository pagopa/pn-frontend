import React from 'react';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import AppNotAccessible from '../AppNotAccessible';

describe('AppNotAccessible Component', () => {
  const assistanceClickHandlerMk = jest.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component', () => {
    const { container } = render(<AppNotAccessible onAssistanceClick={assistanceClickHandlerMk} />);
    expect(container).toHaveTextContent('common - not-accessible.title');
    expect(container).toHaveTextContent('common - not-accessible.description');
  });

  it('clicks on assistance click', () => {
    const { getByTestId } = render(
      <AppNotAccessible onAssistanceClick={assistanceClickHandlerMk} />
    );
    const assistanceLink = getByTestId('assistance-button');
    fireEvent.click(assistanceLink!);
    expect(assistanceClickHandlerMk).toBeCalledTimes(1);
  });
});
