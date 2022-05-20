import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import { configureAxe } from 'jest-axe';
import { toHaveNoViolations } from 'jest-axe';

import { store } from '../redux/store';

const AllTheProviders = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });


export * from '@testing-library/react';
export { customRender as render };

const axe = configureAxe({
  rules: {
    region: { enabled: false },
  },
});
expect.extend(toHaveNoViolations);
export { axe };
