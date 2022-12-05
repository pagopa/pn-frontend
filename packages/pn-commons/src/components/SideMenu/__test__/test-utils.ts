import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { SideMenuItem } from "../../../types";

export const sideMenuItems: Array<SideMenuItem> = [
  { 
    label: 'Item 1',
    icon: QuestionMarkIcon,
    route: 'mocked-route'
  },
  { 
    label: 'Item 2',
    icon: QuestionMarkIcon,
    route: 'mocked-route-2',
    children: [{
      label: 'Item 2-1',
      icon: QuestionMarkIcon,
      route: 'mocked-route-2/mocked-route-2-1'
    }]
  },
  { 
    label: 'Item 3',
    icon: QuestionMarkIcon,
    route: 'mocked-route-3',
    children: [{
      label: 'Item 3-1',
      icon: QuestionMarkIcon,
      route: 'mocked-route-3/mocked-route-3-1'
    }, {
      label: 'Item 3-2',
      icon: QuestionMarkIcon,
      route: 'mocked-route-3/mocked-route-3-2'
    }]
  }
];