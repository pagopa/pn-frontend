import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { BffPublicKeysResponse, PublicKeyStatus } from '../../../generated-client/pg-apikeys';
import { ApiKeyColumnData } from '../../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../../utility/apikeys.utility';
import ApiKeysDataSwitch from '../ApiKeysDataSwitch';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const data: Row<ApiKeyColumnData> = {
  id: publicKeys.items[0].kid!,
  name: publicKeys.items[0].name,
  value: publicKeys.items[0].value,
  date: publicKeys.items[0].createdAt,
  status: publicKeys.items[0].status,
  statusHistory: publicKeys.items[0].statusHistory,
  menu: '',
};

const activeData = {
  ...data,
  status: PublicKeyStatus.Active,
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

  it('renders component - value filled', () => {
    const { container, getByTestId } = render(
      <ApiKeysDataSwitch handleModalClick={mockClick} keys={publicKeys} data={data} type="value" />
    );
    const regexp = new RegExp(`^${data.value!.substring(0, 10)}...$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboard');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - date', () => {
    const { container } = render(
      <ApiKeysDataSwitch handleModalClick={mockClick} keys={publicKeys} data={data} type="date" />
    );
    const regexp = new RegExp(`^${data.date!}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status', () => {
    const { label } = getApiKeyStatusInfos(data.status!, data.statusHistory);
    const { container } = render(
      <ApiKeysDataSwitch handleModalClick={mockClick} keys={publicKeys} data={data} type="status" />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - contextMenu', async () => {
    const { getByTestId } = render(
      <ApiKeysDataSwitch handleModalClick={mockClick} keys={publicKeys} data={data} type="menu" />
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

describe('Menu items', async () => {
  const renderMenu = (data: Row<ApiKeyColumnData>, keys: BffPublicKeysResponse) => {
    const result = render(
      <ApiKeysDataSwitch handleModalClick={vi.fn()} keys={keys} data={data} type="menu" />
    );
    const contextMenu = result.getByTestId('contextMenuButton');
    expect(contextMenu).toBeInTheDocument();
    fireEvent.click(contextMenu);

    return result;
  };

  it('renders rotate button if status is Active and no rotated keys', async () => {
    const keys = {
      ...publicKeys,
      items: publicKeys.items.filter((item) => item.status !== PublicKeyStatus.Rotated),
    };

    const { getByTestId } = renderMenu(activeData, keys);

    const rotateButton = getByTestId('buttonRotate');
    expect(rotateButton).toBeInTheDocument();
  });

  it('not renders rotate button if status is Active and there is a rotated key', async () => {
    const keys = {
      ...publicKeys,
      items: [
        ...publicKeys.items,
        {
          ...publicKeys.items[0],
          status: PublicKeyStatus.Rotated,
        },
      ],
    };

    const { queryByTestId } = renderMenu(activeData, keys);

    const rotateButton = queryByTestId('buttonRotate');
    expect(rotateButton).not.toBeInTheDocument();
  });

  it('renders block button if status is Active and no blocked keys', async () => {
    const keys = {
      ...publicKeys,
      items: publicKeys.items.filter((item) => item.status !== PublicKeyStatus.Blocked),
    };

    const { getByTestId } = renderMenu(activeData, keys);

    const rotateButton = getByTestId('buttonBlock');
    expect(rotateButton).toBeInTheDocument();
  });

  it('not renders rotate button if status is Active and there is a rotated key', async () => {
    const keys = {
      ...publicKeys,
      items: [
        ...publicKeys.items,
        {
          ...publicKeys.items[0],
          status: PublicKeyStatus.Blocked,
        },
      ],
    };

    const { queryByTestId } = renderMenu(activeData, keys);

    const rotateButton = queryByTestId('buttonBlock');
    expect(rotateButton).not.toBeInTheDocument();
  });

  it('render delete button if status is not Active', async () => {
    const blockedData = {
      ...data,
      status: PublicKeyStatus.Blocked,
    };

    const { getByTestId } = renderMenu(blockedData, publicKeys);

    const deleteButton = getByTestId('buttonDelete');
    expect(deleteButton).toBeInTheDocument();
  });
});
