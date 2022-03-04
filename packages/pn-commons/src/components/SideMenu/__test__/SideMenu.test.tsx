import { screen, within } from "@testing-library/react";
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
    expect(ul).toBeInTheDocument();
    const buttons = await within(ul).findAllByRole('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button, i) => {
      const item = button.querySelector('span');
      expect(item).toHaveTextContent(sideMenuItems[i].label);
    });
  });
});