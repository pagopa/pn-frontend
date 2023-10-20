import { ReactNode } from 'react';
import React from 'react';

import { RenderResult, fireEvent, render, waitFor } from '../../../test-utils';
import {
  CustomMobileDialogProvider,
  useCustomMobileDialogContext,
} from '../CustomMobileDialog.context';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <CustomMobileDialogProvider>{children}</CustomMobileDialogProvider>
);

const Component = () => {
  const { open, toggleOpen } = useCustomMobileDialogContext();
  return (
    <div>
      <div>{`Status: ${open}`}</div>
      <button data-testid="buttonTest" onClick={() => toggleOpen()}>
        Click me
      </button>
    </div>
  );
};

describe('CustomMobileDialog Context', () => {
  let result: RenderResult;

  beforeEach(() => {
    // render component
    result = render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
  });

  it('uses CustomMobileDialog Context', () => {
    expect(result.container).toHaveTextContent('Status: false');
  });

  it('changes CustomMobileDialog Context', async () => {
    const button = result.getByTestId('buttonTest');
    fireEvent.click(button!);
    await waitFor(() => expect(result.container).toHaveTextContent('Status: true'));
  });
});
