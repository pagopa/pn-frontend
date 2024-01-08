import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { GET_GROUPS } from '../../../api/external-registries/external-registries-routes';
import GroupSelector from '../GroupSelector';

// this is needed because there is a bug when vi.mock is used
// https://github.com/vitest-dev/vitest/issues/3300
// maybe with vitest 1, we can remove the workaround
const apiClients = await import('../../../api/apiClients');

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const onGroupSelectionCbk = vi.fn();

describe('GroupSelector component', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks that it opens and renders the children correctly', async () => {
    mock.onGet(GET_GROUPS()).reply(200, [
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
    expect(onGroupSelectionCbk).toBeCalledTimes(1);
    expect(onGroupSelectionCbk).toBeCalledWith('group-2');
    await waitFor(() => {
      expect(dropdown).not.toBeInTheDocument();
    });
  });
});
