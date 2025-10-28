import { vi } from 'vitest';

import { selfcareMenuItems, sideMenuItems } from '../../../__mocks__/SideMenu.mock';
import { SideMenuItem } from '../../../models/SideMenuItem';
import { fireEvent, render, waitFor, within } from '../../../test-utils';
import SideMenuList from '../SideMenuList';

async function testMenuItem(
  container: HTMLElement,
  expectedLength: number,
  menuItems: Array<SideMenuItem>
) {
  expect(container).toBeInTheDocument();
  const buttons = await within(container).findAllByRole('button');
  expect(buttons).toHaveLength(expectedLength);
  buttons.forEach((button, i) => {
    const item = button.querySelector('span');
    expect(item).toHaveTextContent(menuItems[i].label);
  });
}

const handleLinkClick = vi.fn();

describe('SideMenuList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', async () => {
    const { getByTestId } = render(
      <SideMenuList
        menuItems={sideMenuItems}
        handleLinkClick={handleLinkClick}
        selectedItem={{
          index: 0,
          label: sideMenuItems[0].label,
          route: sideMenuItems[0].route!,
        }}
      />
    );
    const ul = getByTestId('menu-list');
    await testMenuItem(ul, sideMenuItems.length, sideMenuItems);
  });

  it('open and close sub menu', async () => {
    const { getByTestId } = render(
      <SideMenuList
        menuItems={sideMenuItems}
        handleLinkClick={handleLinkClick}
        selectedItem={{
          index: 0,
          label: sideMenuItems[0].label,
          route: sideMenuItems[0].route!,
        }}
      />
    );
    const ul = getByTestId('menu-list');
    const buttons = within(ul).getAllByRole('button');
    const itemWithChildrenIdx = sideMenuItems.findIndex((item) => item.children);
    // open menu
    fireEvent.click(buttons[itemWithChildrenIdx]);
    if (!sideMenuItems[itemWithChildrenIdx].notSelectable) {
      expect(buttons[itemWithChildrenIdx]).toHaveClass('Mui-selected');
    } else {
      expect(buttons[itemWithChildrenIdx]).not.toHaveClass('Mui-selected');
    }
    let collapsedMenu = within(ul).getByTestId(
      `collapse-${sideMenuItems[itemWithChildrenIdx].label}`
    );
    await testMenuItem(
      collapsedMenu,
      sideMenuItems[itemWithChildrenIdx].children!.length,
      sideMenuItems[itemWithChildrenIdx].children!
    );
    // open another menu
    const otherItemWithChildrenIdx = sideMenuItems.findIndex(
      (item, index) => item.children && index !== itemWithChildrenIdx
    );
    fireEvent.click(buttons[otherItemWithChildrenIdx]);
    if (!sideMenuItems[otherItemWithChildrenIdx].notSelectable) {
      expect(buttons[otherItemWithChildrenIdx]).toHaveClass('Mui-selected');
    } else {
      expect(buttons[otherItemWithChildrenIdx]).not.toHaveClass('Mui-selected');
    }
    await waitFor(() => {
      expect(collapsedMenu).not.toBeInTheDocument();
      if (!sideMenuItems[otherItemWithChildrenIdx].notSelectable) {
        expect(buttons[itemWithChildrenIdx]).not.toHaveClass('Mui-selected');
      } else {
        expect(buttons[itemWithChildrenIdx]).toHaveClass('Mui-selected');
      }
    });
    collapsedMenu = await within(ul).getByTestId(
      `collapse-${sideMenuItems[otherItemWithChildrenIdx].label}`
    );
    await testMenuItem(
      collapsedMenu,
      sideMenuItems[otherItemWithChildrenIdx].children!.length,
      sideMenuItems[otherItemWithChildrenIdx].children!
    );
    // close the same menu
    fireEvent.click(buttons[otherItemWithChildrenIdx]);
    await waitFor(() => {
      expect(collapsedMenu).not.toBeInTheDocument();
    });
    expect(handleLinkClick).toBeCalledTimes(3);
  });

  it('select child menu voice', () => {
    const { getByTestId } = render(
      <SideMenuList
        menuItems={sideMenuItems}
        handleLinkClick={handleLinkClick}
        selectedItem={{
          index: 0,
          label: sideMenuItems[0].label,
          route: sideMenuItems[0].route!,
        }}
      />
    );
    const ul = getByTestId('menu-list');
    const buttons = within(ul).getAllByRole('button');
    // open menu
    const itemWithChildrenIdx = sideMenuItems.findIndex((item) => item.children);
    fireEvent.click(buttons[itemWithChildrenIdx]);
    const collapsedMenu = within(ul).getByTestId(
      `collapse-${sideMenuItems[itemWithChildrenIdx].label}`
    );
    // select a child voice
    const item = within(collapsedMenu).getByTestId(
      `sideMenuItem-${sideMenuItems[itemWithChildrenIdx].children![0].label}`
    );
    fireEvent.click(item);
    expect(item).toHaveClass('Mui-selected');
    expect(handleLinkClick).toBeCalledTimes(2);
  });

  it('renders selfcare itmes', async () => {
    const { getAllByTestId } = render(
      <SideMenuList
        menuItems={sideMenuItems}
        handleLinkClick={handleLinkClick}
        selectedItem={{
          index: 0,
          label: sideMenuItems[0].label,
          route: sideMenuItems[0].route!,
        }}
        selfCareItems={selfcareMenuItems}
      />
    );
    const ul = getAllByTestId('menu-list');
    expect(ul).toHaveLength(2);
    await testMenuItem(ul[0], sideMenuItems.length, sideMenuItems);
    await testMenuItem(ul[1], selfcareMenuItems.length, selfcareMenuItems);
  });
});
