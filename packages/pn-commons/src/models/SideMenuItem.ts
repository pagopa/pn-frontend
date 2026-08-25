import { SvgIconComponent } from '@mui/icons-material';

export interface SideMenuItem {
  label: string;
  icon?: SvgIconComponent | (() => JSX.Element);
  route: string;
  additionalRoutes?: Array<string>;
  children?: Array<SideMenuItem>;
  dotBadge?: boolean;
  dotNotification?: boolean;
  rightBadgeNotification?: number;
  notSelectable?: boolean;
  action?: () => void;
}
