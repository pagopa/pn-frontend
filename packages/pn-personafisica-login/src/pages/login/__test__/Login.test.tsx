import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import { getById, queryById, waitFor } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps } from '../../../utility/storage';
import Login from '../Login';

const mockAssign = vi.fn();
let mockSearchParams = true;

// simulate url params
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  if (mockSearchParams) {
    mockedSearchParams.set(AppRouteParams.AAR, 'fake-aar-token');
  }
  return mockedSearchParams;
}

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      language: 'it',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

describe('test login page', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { assign: mockAssign } });
  });

  afterEach(() => {
    storageAarOps.delete();
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { value: original });
  });

  it('renders page', () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(container).toHaveTextContent(/loginPage.title/i);
    expect(container).toHaveTextContent(/loginPage.description/i);
    const spidButton = getById(container, 'spidButton');
    expect(spidButton).toBeInTheDocument();
    const cieButton = getById(container, 'cieButton');
    expect(cieButton).toBeInTheDocument();
    const spidSelect = queryById(container, 'spidSelect');
    expect(spidSelect).not.toBeInTheDocument();
    expect(storageAarOps.read()).toBe('fake-aar-token');
  });

  it('select spid login', async () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const spidButton = getById(container, 'spidButton');
    fireEvent.click(spidButton!);
    const spidSelect = await waitFor(() => document.querySelector('#spidSelect'));
    expect(spidSelect).toBeInTheDocument();
  });

  it('select CIE login', () => {
    const { URL_API_LOGIN, SPID_CIE_ENTITY_ID } = getConfiguration();
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const cieButton = getById(container, 'cieButton');
    fireEvent.click(cieButton!);
    expect(mockAssign).toBeCalledTimes(1);
    expect(mockAssign).toBeCalledWith(
      `${URL_API_LOGIN}/login?entityID=${SPID_CIE_ENTITY_ID}&authLevel=SpidL2&RelayState=send`
    );
  });

  it('not store data in session storage', () => {
    mockSearchParams = false;
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(storageAarOps.read()).toBeUndefined();
  });
});
