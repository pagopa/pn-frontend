import React from 'react';

import { formatDate } from '@pagopa-pn/pn-commons';

import { mockApiKeysForFE } from '../../../__mocks__/ApiKeys.mock';
import { render } from '../../../__test__/test-utils';
import { getApiKeyStatusInfos } from '../../../utility/apikeys.utility';
import ApiKeyDataSwitch from '../ApiKeyDataSwitch';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const data = mockApiKeysForFE.items[0];

describe('ApiKeyDataSwitch Component', () => {
  it('renders component - name', () => {
    const { container } = render(<ApiKeyDataSwitch data={data} type="name" />);
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - value', () => {
    const { container, getByTestId } = render(<ApiKeyDataSwitch data={data} type="value" />);
    const regexp = new RegExp(`^${data.value.substring(0, 10)}...$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboard');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - lastUpdate', () => {
    const { container } = render(<ApiKeyDataSwitch data={data} type="lastUpdate" />);
    const regexp = new RegExp(`^${formatDate(data.lastUpdate)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it.only('renders component - groups', () => {
    const { container, getByTestId } = render(<ApiKeyDataSwitch data={data} type="groups" />);
    const groupsString =
      data.groups.length > 3
        ? data.groups
            .map((group) => group.name)
            .splice(0, 3)
            .join('') +
          '\\+' +
          (data.groups.length - 3).toString()
        : data.groups.map((group) => group.name).join('');
    const regexp = new RegExp(`^${groupsString}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboardGroupsId');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - status', () => {
    const { label } = getApiKeyStatusInfos(data.status, data.statusHistory);
    const { container } = render(<ApiKeyDataSwitch data={data} type="status" />);
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - contextMenu', () => {
    const { getByTestId } = render(<ApiKeyDataSwitch data={data} type="contextMenu" />);
    const contextMenu = getByTestId('contextMenu');
    expect(contextMenu).toBeInTheDocument();
  });
});
