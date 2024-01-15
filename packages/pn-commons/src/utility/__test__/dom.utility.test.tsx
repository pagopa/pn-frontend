import { useEffect, useState } from 'react';
import { vi } from 'vitest';

import { act, render } from '../../test-utils';
import { WaitForElementResult, waitForElement } from '../dom.utility';

const myInjectedElement = <div className="mocked-class">mocked-test</div>;

const MockComponent = ({
  renderInjectedElement = false,
  delay,
}: {
  renderInjectedElement?: boolean;
  delay?: number;
}) => {
  const [renderElement, setRenderElement] = useState(false);
  useEffect(() => {
    if (renderInjectedElement && !delay) {
      setRenderElement(true);
    } else if (renderInjectedElement && delay) {
      setTimeout(() => act(() => setRenderElement(true)));
    }
  }, []);
  return (
    <div data-testid="mocked-component">
      <div>Mocked component</div>
      {renderElement && <div>{myInjectedElement}</div>}
    </div>
  );
};

describe('waitForElement', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('render MockComponent with injected element after a while simulating time request', async () => {
    render(<MockComponent renderInjectedElement={true} delay={1000} />);
    const waitResult = await waitForElement('.mocked-class');
    expect(waitResult).toBe(WaitForElementResult.DOM_ELEMENT_FOUND);
  });
});
