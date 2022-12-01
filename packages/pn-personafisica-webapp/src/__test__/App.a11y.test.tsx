
import * as React from 'react';
import App from '../App';
import i18n from '../i18n';
import { axe, render } from './test-utils';

const Component = () => (
  <React.Suspense fallback="loading...">
    <App />
  </React.Suspense>
);

describe("App.tsx - accessibility tests", () => {
  it('Test if automatic accessibility tests passes', async () => {
    void i18n.init();
    const { container } = render(<Component />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
