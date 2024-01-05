import React from 'react';
import { vi } from 'vitest';

import { formatDate } from '@pagopa-pn/pn-commons';

import { mockApiKeysForFE } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { getApiKeyStatusInfos } from '../../../utility/apikeys.utility';
import ApiKeyDataSwitch from '../ApiKeyDataSwitch';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const data = mockApiKeysForFE.items[0];

describe('ApiKeyDataSwitch Component', () => {
  const mockClick = vi.fn();

  it('renders component - name', () => {
    const { container } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="name" />
    );
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - value', () => {
    const { container, getByTestId } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="value" />
    );
    const regexp = new RegExp(`^${data.value.substring(0, 10)}...$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboard');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - lastUpdate', () => {
    const { container } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="lastUpdate" />
    );
    const regexp = new RegExp(`^${formatDate(data.lastUpdate)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - groups', () => {
    const { container, getByTestId } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="groups" />
    );
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

  it('renders component - no groups', () => {
    const dataWithNoGroups = {
      ...data,
      groups: [],
    };

    const { queryByTestId } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={dataWithNoGroups} type="groups" />
    );
    const clipboard = queryByTestId('copyToClipboardGroupsId');
    expect(clipboard).not.toBeInTheDocument();
  });

  it('renders component - status', () => {
    const { label } = getApiKeyStatusInfos(data.status, data.statusHistory);
    const { container } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="status" />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - contextMenu', async () => {
    const { getByTestId } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={data} type="contextMenu" />
    );
    const contextMenu = getByTestId('contextMenuButton');
    expect(contextMenu).toBeInTheDocument();
    fireEvent.click(contextMenu);
    const viewGroupsId = getByTestId('buttonViewGroupsId');
    expect(viewGroupsId).toBeInTheDocument();
    fireEvent.click(viewGroupsId);
    expect(mockClick).toBeCalledTimes(1);
  });

  it('renders component - contextMenu no groups', async () => {
    const dataWithNoGroups = {
      ...data,
      groups: [],
    };

    const { getByTestId, queryByTestId } = render(
      <ApiKeyDataSwitch handleModalClick={mockClick} data={dataWithNoGroups} type="contextMenu" />
    );
    const contextMenu = getByTestId('contextMenuButton');
    expect(contextMenu).toBeInTheDocument();
    await waitFor(() => fireEvent.click(contextMenu));
    const viewGroupsId = queryByTestId('buttonViewGroupsId');
    expect(viewGroupsId).not.toBeInTheDocument();
  });
});
