import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, within } from '../../../__test__/test-utils';
import { PublicKeyRow, PublicKeyStatus } from '../../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../../models/ApiKeys';
import PublicKeyContextMenu from '../PublicKeyContextMenu';

const data = (publicKey: PublicKeyRow): Row<ApiKeyColumnData> => ({
  id: publicKey.kid!,
  name: publicKey.name,
  value: publicKey.value,
  date: publicKey.createdAt,
  status: publicKey.status,
  statusHistory: publicKey.statusHistory,
  menu: '',
});

const activeKey = publicKeys.items.find((key) => key.status === PublicKeyStatus.Active);
const noActiveKey = publicKeys.items.find((key) => key.status !== PublicKeyStatus.Active);

const handleModalClickMk = vi.fn();

describe('PublicKeyContextMenu', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Rotate button is shown only if the current key is active and there is no rotated one
  it('render component - rotate button', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={{
          total: publicKeys.total,
          items: publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Rotated),
        }}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).getByTestId('buttonRotate');
    expect(buttonRotate).toBeInTheDocument();
    expect(buttonRotate).toHaveTextContent('context-menu.rotate');
    fireEvent.click(buttonRotate);
    expect(handleModalClickMk).toHaveBeenCalledTimes(1);
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.ROTATE, activeKey!.kid);
  });

  it('render component - no rotate button if no active key', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={{
          total: publicKeys.total,
          items: publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Rotated),
        }}
        data={data(noActiveKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
    expect(buttonRotate).not.toBeInTheDocument();
  });

  it('render component - no rotate button if there is already one rotated key', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={publicKeys}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
    expect(buttonRotate).not.toBeInTheDocument();
  });

  // Block button is shown only if the current key is active and there is no blocked one
  it('render component - block button', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={{
          total: publicKeys.total,
          items: publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Blocked),
        }}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonBlock = within(menuContext).getByTestId('buttonBlock');
    expect(buttonBlock).toBeInTheDocument();
    expect(buttonBlock).toHaveTextContent('context-menu.block');
    fireEvent.click(buttonBlock);
    expect(handleModalClickMk).toHaveBeenCalledTimes(1);
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.BLOCK, activeKey!.kid);
  });

  it('render component - no block button if no active key', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={{
          total: publicKeys.total,
          items: publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Blocked),
        }}
        data={data(noActiveKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonBlock = within(menuContext).queryByTestId('buttonBlock');
    expect(buttonBlock).not.toBeInTheDocument();
  });

  it('render component - no block button if there is already one blocked key', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={publicKeys}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonBlock = within(menuContext).queryByTestId('buttonBlock');
    expect(buttonBlock).not.toBeInTheDocument();
  });

  // View button is always shown
  it('render component - view button', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={publicKeys}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonView = within(menuContext).getByTestId('buttonView');
    expect(buttonView).toBeInTheDocument();
    expect(buttonView).toHaveTextContent('context-menu.view');
    fireEvent.click(buttonView);
    expect(handleModalClickMk).toHaveBeenCalledTimes(1);
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.VIEW, activeKey!.kid);
  });

  // Delete button is shown only if the current key is not active
  it('render component - delete button', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={publicKeys}
        data={data(noActiveKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonDelete = within(menuContext).getByTestId('buttonDelete');
    expect(buttonDelete).toBeInTheDocument();
    expect(buttonDelete).toHaveTextContent('button.elimina');
    fireEvent.click(buttonDelete);
    expect(handleModalClickMk).toHaveBeenCalledTimes(1);
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.DELETE, noActiveKey!.kid);
  });

  it('render component - no delete button if current key is active', () => {
    const { getByTestId } = render(
      <PublicKeyContextMenu
        keys={publicKeys}
        data={data(activeKey!)}
        handleModalClick={handleModalClickMk}
      />
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonDelete = within(menuContext).queryByTestId('buttonDelete');
    expect(buttonDelete).not.toBeInTheDocument();
  });
});
