import { screen, within } from "@testing-library/react";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { render } from "../../../__test__/test-utils"; 
import SideMenu from "../SideMenu";
import { SideMenuItem } from "../SideMenuItem";

const sideMenuItems: Array<SideMenuItem> = [
  { 
    label: 'Item 1',
    icon: QuestionMarkIcon,
    route: ''
  },
  { 
    label: 'Item 2',
    icon: QuestionMarkIcon,
    route: ''
  },
  { 
    label: 'Item 3',
    icon: QuestionMarkIcon,
    route: ''
  }
]

describe('SideMenu', () => {
  it('Render side menu', async () => {
    render(
      <SideMenu menuItems={sideMenuItems}/>
    );
    const ul = screen.getByRole('list');
    expect(ul).toBeTruthy();
    const buttons = await within(ul).findAllByRole('button');
    expect(buttons).toHaveLength(3);
    const firstItem = buttons[0].querySelector('span');
    expect(firstItem).toHaveTextContent(/Item 1/i);
    const secondItem = buttons[1].querySelector('span');
    expect(secondItem).toHaveTextContent(/Item 2/i);
    const thirdItem = buttons[2].querySelector('span');
    expect(thirdItem).toHaveTextContent(/Item 3/i);
  });
});