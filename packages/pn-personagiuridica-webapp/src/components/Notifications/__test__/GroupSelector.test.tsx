import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import GroupSelector from '../GroupSelector';

const onGroupSelectionCbk = vi.fn();

describe('GroupSelector component', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks that it opens and renders the children correctly', async () => {
    mock.onGet('/bff/v1/pg/groups').reply(200, [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
    ]);
    const { getByTestId } = render(
      <GroupSelector currentGroup="group-1" onGroupSelection={onGroupSelectionCbk} />
    );
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });
    const menuButton = getByTestId('groupSelectorButton');
    expect(menuButton).toHaveTextContent('Group 1');
    fireEvent.click(menuButton);
    const dropdown = await waitFor(() => screen.getByRole('presentation'));
    expect(dropdown).toBeInTheDocument();
    const menuItems = within(dropdown).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('Group 1');
    expect(menuItems[1]).toHaveTextContent('Group 2');
    fireEvent.click(menuItems[1]);
    expect(onGroupSelectionCbk).toHaveBeenCalledTimes(1);
    expect(onGroupSelectionCbk).toHaveBeenCalledWith('group-2');
    await waitFor(() => {
      expect(dropdown).not.toBeInTheDocument();
    });
  });
});
