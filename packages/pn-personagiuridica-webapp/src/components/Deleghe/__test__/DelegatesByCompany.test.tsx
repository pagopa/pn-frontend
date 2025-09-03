import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import * as routes from '../../../navigation/routes.const';
import DelegatesByCompany from '../DelegatesByCompany';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('Delegates Component - assuming delegates API works properly', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
    mock.restore();
  });

  it('renders the empty state', () => {
    const { container, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: [],
          },
        },
      },
    });
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addButton = getByTestId('addDeleghe');
    expect(addButton).toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
    // clicks on empty state action
    const button = getByTestId('link-add-delegate');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.NUOVA_DELEGA);
  });

  it('render table with data', async () => {
    const { container, getByTestId, getAllByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: mandatesByDelegator,
          },
        },
      },
    });
    expect(container).not.toHaveTextContent(/deleghe.no_delegates/i);
    const table = getByTestId('delegatesTableDesktop');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('delegatesBodyRowDesktop');
    expect(rows).toHaveLength(mandatesByDelegator.length);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegator[index].delegate?.displayName!);
    });
  });

  it('clicks on add button and navigate to new delegation page', () => {
    const { getByTestId } = render(<DelegatesByCompany />);
    const addButton = getByTestId('addDeleghe');
    fireEvent.click(addButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.NUOVA_DELEGA);
  });

  it('visualize modal code and check code', async () => {
    const { getAllByTestId, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: mandatesByDelegator,
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);

    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(/deleghe.show/i);

    fireEvent.click(menuItems[0]);

    await waitFor(() => {
      const dialog = getByTestId('codeDialog');
      expect(dialog).toBeInTheDocument();

      const textbox = within(dialog).getByRole('textbox');
      // since CodeModal truncates to codeLength (default 5), check only first 5 chars
      expect(textbox).toHaveValue(mandatesByDelegator[0].verificationCode.slice(0, 5));
    });
  });

  it('revoke mandate', async () => {
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegator[0].mandateId}/revoke`).reply(204);
    const { getAllByTestId, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: mandatesByDelegator,
            delegators: [],
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveTextContent(/deleghe.revoke/i);
    fireEvent.click(menuItems[1]);
    const dialog = await waitFor(() => getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    const confirmButton = within(dialog).getByTestId('confirmButton');
    // click on confirm button
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `/bff/v1/mandate/${mandatesByDelegator[0].mandateId}/revoke`
      );
      expect(dialog).not.toBeInTheDocument();
    });
    const table = getByTestId('delegatesTableDesktop');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('delegatesBodyRowDesktop');
    expect(rows).toHaveLength(mandatesByDelegator.length - 1);
    // the index + 1 is because wie revoke the first delegation
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegator[index + 1].delegate?.displayName!);
    });
  });
});
