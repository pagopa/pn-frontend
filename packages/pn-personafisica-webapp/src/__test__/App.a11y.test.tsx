import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider } from '@emotion/react';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { apiClient } from '../api/apiClients';
import { RenderResult, act, axe, render } from './test-utils';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));

const unmockedFetch = global.fetch;

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

describe('App - accessbility tests', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    global.fetch = unmockedFetch;
  });

  it('Test if automatic accessibility tests passes - user not logged in', async () => {
    let renderResult: RenderResult | undefined;
    await act(async () => {
      renderResult = render(<Component />);
    });
    if (renderResult) {
      const result = await axe(renderResult.container);
      expect(result).toHaveNoViolations();
    }
  });
});
