import { FC } from 'react';
import { SideMenuItem } from '../../models';
type Props = {
    menuItems: Array<SideMenuItem>;
    selfCareItems?: Array<SideMenuItem>;
    eventTrackingCallback?: (target: string) => void;
};
declare const SideMenu: FC<Props>;
export default SideMenu;
