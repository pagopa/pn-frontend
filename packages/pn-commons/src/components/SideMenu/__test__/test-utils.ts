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