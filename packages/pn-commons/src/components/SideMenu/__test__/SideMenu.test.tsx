import { fireEvent, prettyDOM, screen, waitFor, within } from "@testing-library/react";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { SideMenuItem } from "../../../types/SideMenuItem";
import { render } from "../../../test-utils";
import SideMenu from "../SideMenu";

const sideMenuItems: Array<SideMenuItem> = [
  { 
    label: 'Item 1',
    icon: QuestionMarkIcon,
    route: ''
  },
  { 
    label: 'Item 2',
    icon: QuestionMarkIcon,
    route: '',
    children: [{
      label: 'Item 2-1',
      icon: QuestionMarkIcon,
      route: ''
    }]
  },
  { 
    label: 'Item 3',
    icon: QuestionMarkIcon,
    route: '',
    children: [{
      label: 'Item 3-1',
      icon: QuestionMarkIcon,
      route: ''
    }, {
      label: 'Item 3-2',
      icon: QuestionMarkIcon,
      route: ''
    }]
  }
];
async function testMenuItem(container: HTMLElement, expectedLength: number, menuItems: Array<SideMenuItem>) {
  expect(container).toBeInTheDocument();
  const buttons = await within(container).findAllByRole('button');
  expect(buttons).toHaveLength(expectedLength);
  buttons.forEach((button, i) => {
    const item = button.querySelector('span');
    expect(item).toHaveTextContent(menuItems[i].label);
  });
}

describe('SideMenu', () => {
  it('Render side menu', async () => {
    render(
      <SideMenu menuItems={sideMenuItems}/>
    );
    const ul = screen.getByRole('list');
    await testMenuItem(ul, sideMenuItems.length, sideMenuItems);
  });

  it('Open and close sub menu', async () => {
    render(
      <SideMenu menuItems={sideMenuItems}/>
    );
    const ul = screen.getByRole('list');
    const buttons = await within(ul).findAllByRole('button');
    await waitFor(() => {
      fireEvent.click(buttons[1]);
    });
    let collapsedMenu = await within(ul).findByTestId(`collapse-${sideMenuItems[1].label}`);
    await testMenuItem(collapsedMenu, sideMenuItems[1].children!.length, sideMenuItems[1].children!);
    await waitFor(() => {
      fireEvent.click(buttons[2]);
    });
    expect(collapsedMenu).not.toBeInTheDocument();
    collapsedMenu = await within(ul).findByTestId(`collapse-${sideMenuItems[2].label}`);
    await testMenuItem(collapsedMenu, sideMenuItems[2].children!.length, sideMenuItems[2].children!);
  });
});