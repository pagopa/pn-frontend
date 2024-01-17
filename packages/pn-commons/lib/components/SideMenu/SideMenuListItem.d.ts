/// <reference types="react" />
import { SideMenuItem } from '../../models';
type Props = {
    item: SideMenuItem;
    selected?: boolean;
    style?: {
        [key: string]: string | number;
    };
    goOutside?: boolean;
    onSelect?: () => void;
    handleLinkClick: (item: SideMenuItem) => void;
};
/**
 * SideMenu List Item: rappresenta un item nel menu di navigazione laterale. Se goOutside è true al click viene aperta un'altra tab del browser.
 * @param item SideMenuItem
 * @param selected boolean, optional
 * @param style optional
 * @param goOutside boolean, default false
 * @param onSelect onSelect action
 * @param handleLinkClick navigation action
 */
declare const SideMenuListItem: ({ item, selected, style, goOutside, handleLinkClick, onSelect, }: Props) => JSX.Element;
export default SideMenuListItem;
