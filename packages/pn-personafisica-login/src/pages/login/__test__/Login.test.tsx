import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouteParams, AppRouteType } from '@pagopa-pn/pn-commons';

import { fireEvent, getById, queryById, render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageSpidSelectedOps, storageTypeOps } from '../../../utils/storage';
import Login from '../Login';

const mockAssign = jest.fn();
let mockSearchParams = true;

// simulate url params
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  if (mockSearchParams) {
    mockedSearchParams.set(AppRouteParams.TYPE, AppRouteType.PF);
    mockedSearchParams.set(AppRouteParams.AAR, 'fake-aar-token');
  }
  return mockedSearchParams;
}

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

describe('test login page', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { assign: mockAssign } });
  });

  afterEach(() => {
    storageAarOps.delete();
    storageSpidSelectedOps.delete();
    storageTypeOps.delete();
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
    expect(storageTypeOps.read()).toBe(AppRouteType.PF);
    expect(storageAarOps.read()).toBe('fake-aar-token');
  });

  it('select spid login', () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const spidButton = getById(container, 'spidButton');
    fireEvent.click(spidButton!);
    const spidSelect = getById(container, 'spidSelect');
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
      `${URL_API_LOGIN}/login?entityID=${SPID_CIE_ENTITY_ID}&authLevel=SpidL2`
    );
    expect(storageSpidSelectedOps.read()).toBe(SPID_CIE_ENTITY_ID);
  });

  it('not store data in session storage', () => {
    mockSearchParams = false;
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(storageTypeOps.read()).toBeUndefined();
    expect(storageAarOps.read()).toBeUndefined();
  });
});
