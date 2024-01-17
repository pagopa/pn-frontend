import { PropsWithChildren, ReactElement } from 'react';
type Props<T> = {
    maxNumberOfItems: number;
    items: Array<T>;
    renderItem: (item: T) => ReactElement;
    renderRemainingItem: (count: number) => ReactElement;
};
declare const CollapsedList: <T>({ maxNumberOfItems, items, renderItem, renderRemainingItem, }: PropsWithChildren<Props<T>>) => JSX.Element;
export default CollapsedList;
