import { Callback, RequestOptions } from 'mixpanel-browser';
import { ReactElement, ReactNode, createContext, useContext } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MockInstance } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { themeNext } from '@pagopa/mui-italia';
import { RenderOptions, RenderResult, render } from '@testing-library/react';

import { PFLoginEventsType } from '../models/PFLoginEventsType';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  route?: string | Array<string>;
  initialIndex?: number;
  path?: string;
}

type CustomRenderResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>;
};

export type PFLoginTriggerEventSpy = MockInstance<
  [eventType: PFLoginEventsType, data?: unknown, trackOptions?: RequestOptions | Callback],
  void
>;

// UiContext and RouterBridge are needed to use wrapper and rerender method
// the RouterProvider doesn't admit children, so to make rerender work we must use context that triggers every time the ui change
const UiContext = createContext<ReactElement | null>(null);

const RouterBridge = () => {
  const currentUi = useContext(UiContext);
  return <>{currentUi}</>;
};

const customRender = (
  ui: ReactElement,
  { route = '/', initialIndex, path = '*', ...renderOptions }: CustomRenderOptions = {}
) => {
  // test router
  const entries = Array.isArray(route) ? route : [route];
  const activeIndex = initialIndex ?? entries.length - 1;
  const router = createMemoryRouter(
    [
      {
        path,
        element: <RouterBridge />,
      },
    ],
    {
      initialEntries: entries, // Initial entries in the in-memory history stack
      initialIndex: activeIndex, // Index of initialEntries the application should initialize to
    }
  );

  // test view
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={themeNext}>
      <UiContext.Provider value={children as ReactElement}>
        <RouterProvider router={router} />
      </UiContext.Provider>
    </ThemeProvider>
  );

  const view = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return { ...view, router };
};

export * from '@testing-library/react';
export { customRender as render };
export type { CustomRenderResult as RenderResult };
