import { PropsWithChildren, ReactElement } from 'react';

type Props<T> = {
  maxNumberOfItems: number;
  items: Array<T>;
  renderItem: (item: T) => ReactElement;
  renderRemainingItem: (count: number) => ReactElement;
};

const CollapsedList = <T,>({
  maxNumberOfItems,
  items,
  renderItem,
  renderRemainingItem,
}: PropsWithChildren<Props<T>>) => {
  const itemsToShow = items.slice(0, maxNumberOfItems);
  const remainingItemsCount = items.length - itemsToShow.length;

  return (
    <>
      {itemsToShow.map((item) => renderItem(item))}
      {remainingItemsCount > 0 && renderRemainingItem(remainingItemsCount)}
    </>
  );
};

export default CollapsedList;
