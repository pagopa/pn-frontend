import React from 'react';
import { vi } from 'vitest';

import { sideMenuItems } from '../../../__mocks__/SideMenu.mock';
import { createMatchMedia, fireEvent, render, waitFor, within } from '../../../test-utils';
import SideMenu from '../SideMenu';

const mockNavigate = vi.fn();
let mockPathname = '';

vi.mock('react-router-dom', async () => ({ 
  ...await vi.importActual('react-router-dom') as any,
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: mockPathname,
  })
}));

describe('SideMenu', () => {
  const original = window.matchMedia;

  beforeEach(() => {
    mockPathname = '';
  });

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders component (no mobile)', async () => {
    const { getByRole } = render(<SideMenu menuItems={sideMenuItems} />);
    const ul = getByRole('navigation');
    expect(ul).toBeInTheDocument();
    const buttons = within(ul).getAllByTestId(/^sideMenuItem-Item \d$/);
    expect(buttons).toHaveLength(sideMenuItems.length);
    // items with children are rendered as an accordion
    // if no root is selected, all the accordion are collapsed
    sideMenuItems.forEach((item, index) => {
      if (item.children) {
        const collapsibleMenu = within(buttons[index]).getByTestId('collapsible-menu');
        expect(collapsibleMenu).toBeInTheDocument();
        const accordion = within(ul).queryByTestId(`collapse-${item.label}`);
        expect(accordion).not.toBeInTheDocument();
      }
    });
  });

  it('checks menu voice selection - route without children', () => {
    mockPathname = sideMenuItems[0].route;
    const { getByRole } = render(<SideMenu menuItems={sideMenuItems} />);
    const ul = getByRole('navigation');
    const buttons = within(ul).getAllByTestId(/^sideMenuItem-Item \d$/);
    buttons.forEach((button, index) => {
      if (index === 0) {
        expect(button).toHaveClass('Mui-selected');
      } else {
        expect(button).not.toHaveClass('Mui-selected');
      }
    });
    // items with children are rendered as an accordion
    // if root selected has no children, all the accordion are collapsed
    sideMenuItems.forEach((item, index) => {
      if (item.children) {
        const collapsibleMenu = within(buttons[index]).getByTestId('collapsible-menu');
        expect(collapsibleMenu).toBeInTheDocument();
        const accordion = within(ul).queryByTestId(`collapse-${item.label}`);
        expect(accordion).not.toBeInTheDocument();
      }
    });
  });

  it('checks menu voice selection - route with children', () => {
    mockPathname = sideMenuItems[1].children![0].route;
    const { getByRole } = render(<SideMenu menuItems={sideMenuItems} />);
    const ul = getByRole('navigation');
    const buttons = within(ul).getAllByTestId(/^sideMenuItem-Item \d$/);
    buttons.forEach((button) => {
      expect(button).not.toHaveClass('Mui-selected');
    });
    // items with children are rendered as an accordion
    // if root selected is a child, the accordion is opened
    sideMenuItems.forEach((item, index) => {
      if (item.children) {
        const collapsibleMenu = within(buttons[index]).getByTestId('collapsible-menu');
        expect(collapsibleMenu).toBeInTheDocument();
        const accordion = within(ul).queryByTestId(`collapse-${item.label}`);
        if (index === 1) {
          expect(accordion).toBeInTheDocument();
          // check that child is selected
          const items = within(accordion!).getAllByTestId(/^sideMenuItem-Item \d-\d$/);
          items.forEach((item, index) => {
            if (index === 0) {
              expect(item).toHaveClass('Mui-selected');
            } else {
              expect(item).not.toHaveClass('Mui-selected');
            }
          });
        } else {
          expect(accordion).not.toBeInTheDocument();
        }
      }
    });
  });

  it('menu navigation', async () => {
    const mockedAction = vi.fn();
    const eventTrackingCallback = vi.fn();
    const menuItems = sideMenuItems.map((item) =>
      item.action ? { ...item, action: mockedAction } : item
    );
    const { getByRole } = render(
      <SideMenu menuItems={menuItems} eventTrackingCallback={eventTrackingCallback} />
    );
    const ul = getByRole('navigation');
    const buttons = within(ul).getAllByTestId(/^sideMenuItem-Item \d$/);
    // no children
    // navigation
    const noChildrenIdx = menuItems.findIndex((item) => !item.children);
    fireEvent.click(buttons[noChildrenIdx]);
    expect(eventTrackingCallback).toBeCalledTimes(1);
    expect(eventTrackingCallback).toBeCalledWith(menuItems[noChildrenIdx].route);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(menuItems[noChildrenIdx].route);
    expect(buttons[noChildrenIdx]).toHaveClass('Mui-selected');
    // with children and notSelectable set to false
    // navigate and open the accordion
    const withChildrenIdx = menuItems.findIndex((item) => item.children && !item.notSelectable);
    fireEvent.click(buttons[withChildrenIdx]);
    expect(eventTrackingCallback).toBeCalledTimes(2);
    expect(eventTrackingCallback).toBeCalledWith(menuItems[withChildrenIdx].route);
    expect(mockNavigate).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledWith(menuItems[withChildrenIdx].route);
    const accordion0 = within(ul).getByTestId(`collapse-${menuItems[withChildrenIdx].label}`);
    expect(accordion0).toBeInTheDocument();
    expect(buttons[withChildrenIdx]).toHaveClass('Mui-selected');
    // with children and notSelectable set to true
    // open the accordion
    const withChildrenAndNotSelectableIdx = menuItems.findIndex(
      (item) => item.children && item.notSelectable
    );
    fireEvent.click(buttons[withChildrenAndNotSelectableIdx]);
    expect(eventTrackingCallback).toBeCalledTimes(3);
    expect(eventTrackingCallback).toBeCalledWith(menuItems[withChildrenAndNotSelectableIdx].route);
    expect(mockNavigate).toBeCalledTimes(2);
    const accordion1 = within(ul).getByTestId(
      `collapse-${menuItems[withChildrenAndNotSelectableIdx].label}`
    );
    await waitFor(() => {
      expect(accordion0).not.toBeInTheDocument();
    });
    expect(accordion1).toBeInTheDocument();
    expect(buttons[withChildrenAndNotSelectableIdx]).not.toHaveClass('Mui-selected');
    // no children and no route
    // no navigation and action call
    const noChildrenAndNoRouteIdx = menuItems.findIndex((item) => !item.children && !item.route);
    fireEvent.click(buttons[noChildrenAndNoRouteIdx]);
    expect(eventTrackingCallback).toBeCalledTimes(4);
    expect(eventTrackingCallback).toBeCalledWith(menuItems[noChildrenAndNoRouteIdx].route);
    expect(mockNavigate).toBeCalledTimes(2);
    expect(mockedAction).toBeCalledTimes(1);
    expect(buttons[noChildrenAndNoRouteIdx]).toHaveClass('Mui-selected');
  });

  it('renders component (mobile)', async () => {
    window.matchMedia = createMatchMedia(800);
    const { getByRole } = render(<SideMenu menuItems={sideMenuItems} />);
    const ul = getByRole('navigation');
    expect(ul).toBeInTheDocument();
    const menuButtons = within(ul).getAllByRole('button');
    expect(menuButtons).toHaveLength(1);
    fireEvent.click(menuButtons[0]);
    const drawer = await waitFor(() => getByRole('presentation'));
    expect(drawer).toBeInTheDocument();
    const buttons = within(drawer).getAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });
});
