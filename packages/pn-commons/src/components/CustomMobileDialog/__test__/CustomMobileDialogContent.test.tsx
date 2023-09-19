import React from 'react';

import { fireEvent, render, screen, within } from '../../../test-utils';
import * as customContext from '../CustomMobileDialog.context';
import CustomMobileDialogContent from '../CustomMobileDialogContent';

describe('CustomMobileDialogContent Component', () => {
  const contextMockedFn = jest.fn();

  beforeEach(() => {
    // mock custom hook
    const customHookSpy = jest.spyOn(customContext, 'useCustomMobileDialogContext');
    customHookSpy.mockReturnValue({ open: true, toggleOpen: contextMockedFn });
    // render component
    render(
      <CustomMobileDialogContent title="Mocked title">Mocked content</CustomMobileDialogContent>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders CustomMobileDialogContent', () => {
    const dialog = screen.queryByTestId('mobileDialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Mocked title/i);
    expect(dialog).toHaveTextContent(/Mocked content/i);
  });

  it('clicks on close icon', async () => {
    const dialog = screen.queryByTestId('mobileDialog');
    const closeIcon = await within(dialog!).queryByTestId('CloseIcon');
    fireEvent.click(closeIcon!);
    expect(contextMockedFn).toBeCalledTimes(1);
  });
});
