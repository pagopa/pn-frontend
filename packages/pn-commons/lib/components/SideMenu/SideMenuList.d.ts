/// <reference types="react" />
import { SideMenuItem } from '../../models';
type Props = {
    menuItems: Array<SideMenuItem>;
    selfCareItems?: Array<SideMenuItem>;
    handleLinkClick: (item: SideMenuItem, flag?: boolean) => void;
    selectedItem: {
        index: number;
        label: string;
        route: string;
        parent?: string;
    };
};
declare const SideMenuList: ({ menuItems, selfCareItems, handleLinkClick, selectedItem }: Props) => JSX.Element;
export default SideMenuList;
