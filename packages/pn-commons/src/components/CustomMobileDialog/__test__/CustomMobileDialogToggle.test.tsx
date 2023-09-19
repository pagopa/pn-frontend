import React from 'react';

import { RenderResult, fireEvent, render } from '../../../test-utils';
import CustomMobileDialog from '../CustomMobileDialog';
import CustomMobileDialogContent from '../CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialogToggle';

describe('CustomMobileDialog Component', () => {
  let result: RenderResult | undefined;
  const contextMockedFn = jest.fn();

  beforeEach(() => {
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

  // TO-DO: Mock function toggleOpen from createContext
  it.skip('clicks on button', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    expect(contextMockedFn).toBeCalledTimes(1);
  });
});
