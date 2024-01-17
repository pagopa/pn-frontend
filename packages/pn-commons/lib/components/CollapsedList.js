import { Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const CollapsedList = ({ maxNumberOfItems, items, renderItem, renderRemainingItem, }) => {
    const itemsToShow = items.slice(0, maxNumberOfItems);
    const remainingItemsCount = items.length - itemsToShow.length;
    return (_jsxs(_Fragment, { children: [itemsToShow.map((item) => renderItem(item)), remainingItemsCount > 0 && renderRemainingItem(remainingItemsCount)] }));
};
export default CollapsedList;
