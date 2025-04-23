import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { publicKeys, virtualKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ApiKeyColumnData, ExtendedVirtualKeyStatus } from '../../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../../utility/apikeys.utility';
import ApiKeysDataSwitch from '../ApiKeysDataSwitch';

const dataP: Row<ApiKeyColumnData> = {
  id: publicKeys.items[0].kid!,
  name: publicKeys.items[0].name,
  value: publicKeys.items[0].value,
  date: publicKeys.items[0].createdAt,
  status: publicKeys.items[0].status,
  statusHistory: publicKeys.items[0].statusHistory,
  menu: '',
};

const dataV: Row<ApiKeyColumnData> = {
  id: virtualKeys.items[0].id!,
  name: virtualKeys.items[0].name,
  value: virtualKeys.items[0].value,
  date: virtualKeys.items[0].lastUpdate,
  status: virtualKeys.items[0].status,
  user: virtualKeys.items[0].user,
  menu: '',
};

const mockClick = vi.fn();

describe('Api Keys Data Switch', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - name', () => {
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={dataP}
        type="name"
        menuType="publicKeys"
      />
    );
    const regexp = new RegExp(`^${dataP.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - value empty', () => {
    const { container, queryByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={{ ...dataP, value: undefined }}
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
        data={dataP}
        menuType="publicKeys"
        type="value"
      />
    );
    const regexp = new RegExp(`^${dataP.value}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const clipboard = getByTestId('copyToClipboard');
    expect(clipboard).toBeInTheDocument();
  });

  it('renders component - date', () => {
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={dataP}
        menuType="publicKeys"
        type="date"
      />
    );
    const regexp = new RegExp(`^${dataP.date!}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status', () => {
    const { label } = getApiKeyStatusInfos(dataP.status!, dataP.statusHistory);
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={dataP}
        menuType="publicKeys"
        type="status"
      />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status for virtual key with issuer active', () => {
    const dataEnabledV = { ...dataV, status: ExtendedVirtualKeyStatus.Enabled };
    const { label } = getApiKeyStatusInfos(dataEnabledV.status);
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={virtualKeys}
        data={dataEnabledV}
        menuType="virtualKeys"
        type="status"
        issuerIsPresent
        issuerIsActive
      />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status for virtual key with issuer not active', () => {
    const dataEnabledV = { ...dataV, status: ExtendedVirtualKeyStatus.Enabled };
    const { label } = getApiKeyStatusInfos(ExtendedVirtualKeyStatus.Disabled);
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={virtualKeys}
        data={dataEnabledV}
        menuType="virtualKeys"
        type="status"
        issuerIsPresent
        issuerIsActive={false}
      />
    );
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - contextMenu for public keys', async () => {
    const { getByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={dataP}
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

  it('renders component - contextMenu for virtual keys', async () => {
    const { getByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={virtualKeys}
        data={dataV}
        menuType="virtualKeys"
        type="menu"
        issuerIsPresent
      />,
      { preloadedState: { userState: { user: { fiscal_number: dataV.user?.fiscalCode } } } }
    );
    const contextMenu = getByTestId('contextMenuButton');
    expect(contextMenu).toBeInTheDocument();
    fireEvent.click(contextMenu);
    const viewGroupsId = getByTestId('buttonView');
    expect(viewGroupsId).toBeInTheDocument();
    fireEvent.click(viewGroupsId);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('renders component - contextMenu for virtual keys hidden if issuer is not present', async () => {
    const { queryByTestId } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={virtualKeys}
        data={dataV}
        menuType="virtualKeys"
        type="menu"
        issuerIsPresent={false}
      />,
      { preloadedState: { userState: { user: { fiscal_number: dataV.user?.fiscalCode } } } }
    );
    const contextMenu = queryByTestId('contextMenuButton');
    expect(contextMenu).not.toBeInTheDocument();
  });
});
