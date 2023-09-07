import React from 'react';

import { RenderResult, fireEvent } from '@testing-library/react';

import { render } from '../../../test-utils';
import * as customContext from '../CustomMobileDialog.context';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialog Component', () => {
  let result: RenderResult | undefined;
  const contextMockedFn = jest.fn();

  beforeEach(() => {
    // mock custom hook
    const customHookSpy = jest.spyOn(customContext, 'useCustomMobileDialogContext');
    customHookSpy.mockReturnValue({ open: false, toggleOpen: contextMockedFn });
    // render component
    result = render(<CustomMobileDialogToggle>Mocked title</CustomMobileDialogToggle>);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('renders CustomMobileDialogToggle', () => {
    const button = result?.getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/Mocked title/i);
  });

  it('clicks on button', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    expect(contextMockedFn).toBeCalledTimes(1);
  });
});
