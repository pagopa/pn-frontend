import React from 'react';

import { fireEvent, mockApi, within, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { GET_GROUPS } from '../../../api/external-registries/external-registries-routes';
import GroupSelector from '../GroupSelector';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const onGroupSelectionCbk = jest.fn();

describe('GroupSelector component', () => {
  it('checks that it opens and renders the children correctly', async () => {
    const mock = mockApi(apiClient, 'GET', GET_GROUPS(), 200, undefined, [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
    ]);
    const result = render(
      <GroupSelector currentGroup="group-1" onGroupSelection={onGroupSelectionCbk} />
    );
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });
    const menuButton = result.getByTestId('groupSelectorButton');
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
    mock.reset();
    mock.restore();
  });
});
