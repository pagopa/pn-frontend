import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ApiKeyColumnData } from '../../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../../utility/apikeys.utility';
import ApiKeysDataSwitch from '../ApiKeysDataSwitch';

const data: Row<ApiKeyColumnData> = {
  id: publicKeys.items[0].kid!,
  name: publicKeys.items[0].name,
  value: publicKeys.items[0].value,
  date: publicKeys.items[0].createdAt,
  status: publicKeys.items[0].status,
  statusHistory: publicKeys.items[0].statusHistory,
  menu: '',
};

describe('Api Keys Data Switch', () => {
  const mockClick = vi.fn();

  it('renders component - name', () => {
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        type="name"
        menuType="publicKeys"
      />
    );
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - value empty', () => {
    const { container, queryByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={{ ...data, value: undefined }}
        menuType="publicKeys"
        type="value"
      />
    );
    expect(container).toHaveTextContent('-');
    const clipboard = queryByTestId('copyToClipboard');
    expect(clipboard).not.toBeInTheDocument();
  });

  it('renders component - value filled', () => {
    const { container, getByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        menuType="publicKeys"
        type="value"
      />
    );
    const regexp = new RegExp(`^${data.value}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboard');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - date', () => {
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        menuType="publicKeys"
        type="date"
      />
    );
    const regexp = new RegExp(`^${data.date!}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status', () => {
    const { label } = getApiKeyStatusInfos(data.status!, data.statusHistory);
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        menuType="publicKeys"
        type="status"
      />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - contextMenu', async () => {
    const { getByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        menuType="publicKeys"
        type="menu"
      />
    );
    const contextMenu = getByTestId('contextMenuButton');
    expect(contextMenu).toBeInTheDocument();
    fireEvent.click(contextMenu);
    const viewGroupsId = getByTestId('buttonView');
    expect(viewGroupsId).toBeInTheDocument();
    fireEvent.click(viewGroupsId);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
