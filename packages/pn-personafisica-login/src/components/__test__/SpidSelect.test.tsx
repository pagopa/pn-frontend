import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../__test__/test-utils';
import { getConfiguration } from '../../services/configuration.service';
import { getIDPS } from '../../utility/IDPS';
import { storageRapidAccessOps } from '../../utility/storage';
import SpidSelect from '../SpidSelect';

const idps = getIDPS(false, false);
const mockAssign = vi.fn();
const backHandler = vi.fn();

describe('test spid select page', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { assign: mockAssign } });
  });

  afterEach(() => {
    storageRapidAccessOps.delete();
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { value: original });
  });

  it('renders page', () => {
    const { URL_API_LOGIN } = getConfiguration();
    render(<SpidSelect onClose={backHandler} show={true} />);
    const container = document.body;
    expect(container).toHaveTextContent('spidSelect.title');
    const backIcon = getById(container, 'backIcon');
    expect(backIcon).toBeInTheDocument();
    idps.identityProviders.forEach((element, index) => {
      const spidButton = getById(container, `spid-select-${element.entityId}`);
      fireEvent.click(spidButton);
      expect(mockAssign).toHaveBeenCalledTimes(index + 1);
      expect(mockAssign).toHaveBeenCalledWith(
        `${URL_API_LOGIN}/login?entityID=${element.entityId}&authLevel=SpidL2&RelayState=send`
      );
    });
    const requestForSpid = getById(container, 'requestForSpid');
    expect(requestForSpid).toBeInTheDocument();
    const backButton = getById(container, 'backButton');
    expect(backButton).toBeInTheDocument();
  });

  it('clicks on back buttons', () => {
    render(<SpidSelect onClose={backHandler} show={true} />);
    const container = document.body;
    const backIcon = getById(document.body, 'backIcon');
    fireEvent.click(backIcon);
    expect(backHandler).toHaveBeenCalledTimes(1);
    const backButton = getById(container, 'backButton');
    fireEvent.click(backButton);
    expect(backHandler).toHaveBeenCalledTimes(2);
  });

  it('request spid', () => {
    render(<SpidSelect onClose={backHandler} show={true} />);
    const container = document.body;
    const requestForSpid = getById(container, 'requestForSpid');
    expect(requestForSpid).toHaveAttribute('href', idps.richiediSpid);
  });

  it('stores rapidAccess to sessionStorage on SPID provider click', () => {
    const rapidAccess: [AppRouteParams, string] = [AppRouteParams.AAR, 'fake-aar-token'];
    render(<SpidSelect onClose={backHandler} show={true} rapidAccess={rapidAccess} />);
    const idp = idps.identityProviders[0];
    const spidButton = getById(document.body, `spid-select-${idp.entityId}`);
    fireEvent.click(spidButton);
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('fake-aar-token');
    expect(localStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });

  it('does not write storage when rapidAccess is undefined', () => {
    render(<SpidSelect onClose={backHandler} show={true} />);
    const idp = idps.identityProviders[0];
    const spidButton = getById(document.body, `spid-select-${idp.entityId}`);
    fireEvent.click(spidButton);
    expect(storageRapidAccessOps.read()).toBeUndefined();
  });
});
