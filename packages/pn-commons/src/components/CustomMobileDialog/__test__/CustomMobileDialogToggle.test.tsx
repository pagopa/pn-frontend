import React from 'react';

import { RenderResult, fireEvent, render } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import * as customContext from '../CustomMobileDialog.context';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialog Component', () => {
  let result: RenderResult | undefined;
  const contextMockedFn = jest.fn();

  beforeEach(() => {
    const customHookSpy = jest.spyOn(customContext, 'useCustomMobileDialogContext');
    customHookSpy.mockReturnValue({ open: false, toggleOpen: contextMockedFn });

    // render component
    result = render(
      <CustomMobileDialog>
        <CustomMobileDialogToggle hasCounterBadge bagdeCount={1}>
          mocked dialog toggle title
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title={'mocked dialog toggle title'}>
          mocked content
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('renders CustomMobileDialogToggle', () => {
    const button = result?.getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/mocked dialog toggle title/i);
  });

  it('clicks on button', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    expect(contextMockedFn).toBeCalledTimes(1);
  });
});
