import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { virtualKeysOfUser } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, within } from '../../../__test__/test-utils';
import { VirtualKey, VirtualKeyStatus } from '../../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../../models/ApiKeys';
import { PNRole } from '../../../models/User';
import VirtualKeyContextMenu from '../VirtualKeyContextMenu';

const data = (virtualKey: VirtualKey): Row<ApiKeyColumnData> => ({
  id: virtualKey.id!,
  name: virtualKey.name,
  value: virtualKey.value,
  date: virtualKey.lastUpdate,
  status: virtualKey.status,
  user: virtualKey.user,
  menu: '',
});

// virtual keys returned for an user that is not an admin, don't have the user key
// virtual keys returned for an user that is an admin, have the user key
const virtualKeys = {
  ...virtualKeysOfUser,
  items: virtualKeysOfUser.items.map((key) => ({
    ...key,
    user: {
      denomination: 'Mario Rossi',
      fiscalCode: 'RSSMRA93E04H502V',
    },
  })),
};

const testData = [
  {
    case: 'not admin user',
    user: { organization: { roles: [{ role: PNRole.OPERATOR }] } },
    keys: virtualKeysOfUser,
    enabledKey: virtualKeysOfUser.items.find((key) => key.status === VirtualKeyStatus.Enabled),
    notEnabledKey: virtualKeysOfUser.items.find((key) => key.status !== VirtualKeyStatus.Enabled),
    rotatedKey: virtualKeysOfUser.items.find((key) => key.status === VirtualKeyStatus.Rotated),
  },
  {
    case: 'admin user',
    user: {
      organization: { roles: [{ role: PNRole.ADMIN }] },
      fiscal_number: 'RSSMRA93E04H502V',
    },
    keys: virtualKeys,
    enabledKey: virtualKeys.items.find((key) => key.status === VirtualKeyStatus.Enabled),
    notEnabledKey: virtualKeys.items.find((key) => key.status !== VirtualKeyStatus.Enabled),
    rotatedKey: virtualKeys.items.find((key) => key.status === VirtualKeyStatus.Rotated),
  },
];

const handleModalClickMk = vi.fn();

describe('VirtualKeyContextMenu', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Rotate button is shown only if the current key is enabled, there is no rotated one
  // that belongs to the current user and issuer is active
  it.each(testData)('render component - rotate button ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: d.keys.total,
          items: d.keys.items.filter((key) => key.status !== VirtualKeyStatus.Rotated),
        }}
        data={data(d.enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
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
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.ROTATE, d.enabledKey!.id);
  });

  it.each(testData)('render component - no rotate button if no enabled key ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: d.keys.total,
          items: d.keys.items.filter((key) => key.status !== VirtualKeyStatus.Rotated),
        }}
        data={data(d.notEnabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
    expect(buttonRotate).not.toBeInTheDocument();
  });

  it.each(testData)(
    'render component - no rotate button if there is already one rotated key ($case)',
    (d) => {
      const { getByTestId } = render(
        <VirtualKeyContextMenu
          keys={d.keys}
          data={data(d.enabledKey!)}
          handleModalClick={handleModalClickMk}
          issuerIsActive
        />,
        {
          preloadedState: {
            userState: {
              user: d.user,
            },
          },
        }
      );
      const contextMenuButton = getByTestId('contextMenuButton');
      expect(contextMenuButton).toBeInTheDocument();
      fireEvent.click(contextMenuButton);
      const menuContext = getByTestId('menuContext');
      expect(menuContext).toBeInTheDocument();
      const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
      expect(buttonRotate).not.toBeInTheDocument();
    }
  );

  it.each(testData)("render component - no rotate button if issuer isn't active ($case)", (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={d.keys}
        data={data(d.enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive={false}
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
    expect(buttonRotate).not.toBeInTheDocument();
  });

  it("render component - no rotate button if the user doesn't own the key ('admin user')", () => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: testData[1].keys.total,
          items: testData[1].keys.items.filter((key) => key.status !== VirtualKeyStatus.Blocked),
        }}
        data={data(testData[1].enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: { ...testData[1].user, fiscal_number: 'different_fiscal_number' },
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonRotate = within(menuContext).queryByTestId('buttonRotate');
    expect(buttonRotate).not.toBeInTheDocument();
  });

  // Block button is shown only if the current key is not rotated and there is no blocked one
  it.each(testData)('render component - block button ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: d.keys.total,
          items: d.keys.items.filter((key) => key.status !== VirtualKeyStatus.Blocked),
        }}
        data={data(d.enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
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
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.BLOCK, d.enabledKey!.id);
  });

  it.each(testData)('render component - no block button if it is a rotated key ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: d.keys.total,
          items: d.keys.items.filter((key) => key.status !== VirtualKeyStatus.Blocked),
        }}
        data={data(d.rotatedKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonBlock = within(menuContext).queryByTestId('buttonBlock');
    expect(buttonBlock).not.toBeInTheDocument();
  });

  it.each(testData)(
    'render component - no block button if there is already one blocked key ($case)',
    (d) => {
      const { getByTestId } = render(
        <VirtualKeyContextMenu
          keys={d.keys}
          data={data(d.enabledKey!)}
          handleModalClick={handleModalClickMk}
          issuerIsActive
        />,
        {
          preloadedState: {
            userState: {
              user: d.user,
            },
          },
        }
      );
      const contextMenuButton = getByTestId('contextMenuButton');
      expect(contextMenuButton).toBeInTheDocument();
      fireEvent.click(contextMenuButton);
      const menuContext = getByTestId('menuContext');
      expect(menuContext).toBeInTheDocument();
      const buttonBlock = within(menuContext).queryByTestId('buttonBlock');
      expect(buttonBlock).not.toBeInTheDocument();
    }
  );

  // View button is shown if the user is the owner of the key
  it.each(testData)('render component - view button ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={d.keys}
        data={data(d.enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
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
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.VIEW, d.enabledKey!.id);
  });

  it("render component - no view button if the user doesn't own the key ('admin user')", () => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={{
          total: testData[1].keys.total,
          items: testData[1].keys.items.filter((key) => key.status !== VirtualKeyStatus.Blocked),
        }}
        data={data(testData[1].enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: { ...testData[1].user, fiscal_number: 'different_fiscal_number' },
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonView = within(menuContext).queryByTestId('buttonView');
    expect(buttonView).not.toBeInTheDocument();
  });

  // Delete button is shown only if the current key is not active
  it.each(testData)('render component - delete button ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={virtualKeys}
        data={data(d.notEnabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
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
    expect(handleModalClickMk).toHaveBeenCalledWith(ModalApiKeyView.DELETE, d.notEnabledKey!.id);
  });

  it.each(testData)('render component - no delete button if current key is active ($case)', (d) => {
    const { getByTestId } = render(
      <VirtualKeyContextMenu
        keys={virtualKeys}
        data={data(d.enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: d.user,
          },
        },
      }
    );
    const contextMenuButton = getByTestId('contextMenuButton');
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const menuContext = getByTestId('menuContext');
    expect(menuContext).toBeInTheDocument();
    const buttonDelete = within(menuContext).queryByTestId('buttonDelete');
    expect(buttonDelete).not.toBeInTheDocument();
  });

  it('hide context menu if no action is available', () => {
    const { queryByTestId } = render(
      <VirtualKeyContextMenu
        keys={testData[1].keys}
        data={data(testData[1].enabledKey!)}
        handleModalClick={handleModalClickMk}
        issuerIsActive
      />,
      {
        preloadedState: {
          userState: {
            user: { ...testData[1].user, fiscal_number: 'different_fiscal_number' },
          },
        },
      }
    );
    const contextMenuButton = queryByTestId('contextMenuButton');
    expect(contextMenuButton).not.toBeInTheDocument();
  });
});
