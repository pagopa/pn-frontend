import React from 'react';

import { fireEvent, render } from '../../test-utils';
import AppNotAccessible from '../AppNotAccessible';

describe('AppNotAccessible Component', () => {
  const assistanceClickHandlerMk = jest.fn();

  it('renders component', () => {
    const result = render(<AppNotAccessible onAssistanceClick={assistanceClickHandlerMk} />);
    expect(result.container).toHaveTextContent('Non è possibile accedere alla piattaforma');
    expect(result.container).toHaveTextContent(
      'Riprova tra qualche ora. Se hai bisogno di assistenza scrivici.'
    );
  });

  it('clicks on assistance click', () => {
    const result = render(<AppNotAccessible onAssistanceClick={assistanceClickHandlerMk} />);
    const assistanceLink = result.queryByTestId('assistance-button');
    fireEvent.click(assistanceLink!);
    expect(assistanceClickHandlerMk).toBeCalledTimes(1);
  });
});
