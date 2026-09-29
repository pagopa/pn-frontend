import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';

import { SideMenuItem } from '../models/SideMenuItem';

export const sideMenuItems: Array<SideMenuItem> = [
  {
    label: 'Item 1',
    icon: QuestionMarkRoundedIcon,
    route: '/mocked-route',
  },
  {
    label: 'Item 2',
    icon: QuestionMarkRoundedIcon,
    route: '/mocked-route-2',
    children: [
      {
        label: 'Item 2-1',
        icon: QuestionMarkRoundedIcon,
        route: '/mocked-route-2/mocked-route-2-1',
      },
      {
        label: 'Item 2-2',
        icon: QuestionMarkRoundedIcon,
        route: '',
      },
    ],
  },
  {
    label: 'Item 3',
    icon: QuestionMarkRoundedIcon,
    route: '/mocked-route-3',
    notSelectable: true,
    children: [
      {
        label: 'Item 3-1',
        icon: QuestionMarkRoundedIcon,
        route: '/mocked-route-3/mocked-route-3-1',
      },
      {
        label: 'Item 3-2',
        icon: QuestionMarkRoundedIcon,
        route: '/mocked-route-3/mocked-route-3-2',
        notSelectable: true,
      },
    ],
  },
  {
    label: 'Item 4',
    icon: QuestionMarkRoundedIcon,
    route: '',
    action: () => {},
  },
];

export const selfcareMenuItems: Array<SideMenuItem> = [
  {
    label: 'SelfcareItem 1',
    icon: QuestionMarkRoundedIcon,
    route: 'mocked-route',
  },
  {
    label: 'SelfcareItem 2',
    icon: QuestionMarkRoundedIcon,
    route: 'mocked-route-2',
  },
];
