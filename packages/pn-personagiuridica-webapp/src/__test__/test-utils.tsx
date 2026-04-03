import { ReactElement, ReactNode, createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router-dom';

import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
import { InitialEntry } from '@remix-run/router';
import { RenderOptions, RenderResult, render } from '@testing-library/react';

import { RootState, appReducers } from '../redux/store';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  route?: string | Array<InitialEntry>;
  initialIndex?: number;
  path?: string;
  extraRoutes?: Array<RouteObject>;
}

type CustomRenderResult = RenderResult & {
  testStore: EnhancedStore<RootState>;
  router: ReturnType<typeof createMemoryRouter>;
};

// UiContext and RouterBridge are needed to use wrapper and rerender method
// the RouterProvider doesn't admit children, so to make rerender work we must use context that triggers every time the ui change
const UiContext = createContext<ReactElement | null>(null);

const RouterBridge = () => {
  const currentUi = useContext(UiContext);
  return <>{currentUi}</>;
};

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    route = '/',
    initialIndex,
    path = '*',
    extraRoutes = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // test redux store
  const testStore = configureStore({
    reducer: appReducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  // test router
  const entries = Array.isArray(route) ? route : [route];
  const activeIndex = initialIndex ?? entries.length - 1;
  const router = createMemoryRouter(
    [
      {
        path,
        element: <RouterBridge />,
      },
      ...extraRoutes,
    ],
    {
      initialEntries: entries, // Initial entries in the in-memory history stack
      initialIndex: activeIndex, // Index of initialEntries the application should initialize to
    }
  );

  // test view
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={testStore}>
      <UiContext.Provider value={children as ReactElement}>
        <RouterProvider router={router} />
      </UiContext.Provider>
    </Provider>
  );
  const view = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return { ...view, router, testStore };
};

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: appReducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export * from '@testing-library/react';
export { customRender as render, createTestStore };
export type { CustomRenderResult as RenderResult };
