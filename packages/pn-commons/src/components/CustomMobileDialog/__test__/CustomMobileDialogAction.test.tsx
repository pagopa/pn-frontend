import React from 'react';

import { RenderResult, fireEvent, render } from '../../../test-utils';
import * as customContext from '../CustomMobileDialog.context';
import CustomMobileDialogAction from '../CustomMobileDialogAction';

describe('CustomMobileDialogAction Component', () => {
  let result: RenderResult | undefined;
  const contextMockedFn = jest.fn();

  beforeEach(() => {
    // mock custom hook
    const customHookSpy = jest.spyOn(customContext, 'useCustomMobileDialogContext');
    customHookSpy.mockReturnValue({ open: true, toggleOpen: contextMockedFn });
    // render component
    result = render(
      <CustomMobileDialogAction closeOnClick>Mocked action</CustomMobileDialogAction>
    );
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('renders CustomMobileDialogAction', () => {
    const button = result?.getByTestId('dialogAction');
    expect(button).toHaveTextContent(/Mocked action/i);
  });

  it('clicks on action', () => {
    const button = result?.getByTestId('dialogAction');
    fireEvent.click(button!);
    expect(contextMockedFn).toBeCalledTimes(1);
  });
});
