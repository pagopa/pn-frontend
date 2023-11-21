import React, { ReactNode } from 'react';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { getIDPS } from '../../../utility/IDPS';
import SpidSelect from '../SpidSelect';

const idps = getIDPS(false, false);
const mockAssign = jest.fn();
const backHandler = jest.fn();

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({ t: (str: string) => str }),
  Trans: (props: { i18nKey: string; children: ReactNode }) => (
    <>
      {props.i18nKey} {props.children}
    </>
  ),
}));

describe('test spid select page', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { assign: mockAssign } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { value: original });
  });

  it('renders page', () => {
    const { URL_API_LOGIN } = getConfiguration();
    const { container } = render(<SpidSelect onBack={backHandler} />);
    expect(container).toHaveTextContent('spidSelect.title');
    const backIcon = getById(container, 'backIcon');
    expect(backIcon).toBeInTheDocument();
    idps.identityProviders.forEach((element, index) => {
      const spidButton = getById(container, `spid-select-${element.entityId}`);
      fireEvent.click(spidButton);
      expect(mockAssign).toBeCalledTimes(index + 1);
      expect(mockAssign).toBeCalledWith(
        `${URL_API_LOGIN}/login?entityID=${element.entityId}&authLevel=SpidL2&RelayState=send`
      );
    });
    const requestForSpid = getById(container, 'requestForSpid');
    expect(requestForSpid).toBeInTheDocument();
    const backButton = getById(container, 'backButton');
    expect(backButton).toBeInTheDocument();
  });

  it('clicks on back buttons', () => {
    const { container } = render(<SpidSelect onBack={backHandler} />);
    const backIcon = getById(container, 'backIcon');
    fireEvent.click(backIcon);
    expect(backHandler).toBeCalledTimes(1);
    const backButton = getById(container, 'backButton');
    fireEvent.click(backButton);
    expect(backHandler).toBeCalledTimes(2);
  });

  it('request spid', () => {
    const { container } = render(<SpidSelect onBack={backHandler} />);
    const requestForSpid = getById(container, 'requestForSpid');
    expect(requestForSpid).toHaveAttribute('href', idps.richiediSpid);
  });
});
