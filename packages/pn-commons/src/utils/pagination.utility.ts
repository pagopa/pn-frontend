function calcDisplayedPages(
  pages: Array<number>,
  numOfDisplayedPages: number,
  pageSelected: number,
  direction: 'prev' | 'next'
): Array<number> {
  // if displayedPages is odd, we show the same number of page before and after
  // if displayedPages is even, we show more pages before than after if we are navigating forward, the opposite if we are navigating backward
  /* eslint-disable functional/no-let */
  let firstPageToDisplay = 0;
  /* eslint-disable functional/no-let */
  let lastPageToDisplay = 0;
  if (numOfDisplayedPages % 2 === 0) {
    firstPageToDisplay =
      pageSelected - (direction === 'next' ? numOfDisplayedPages / 2 - 1 : numOfDisplayedPages / 2);
    lastPageToDisplay =
      pageSelected + (direction === 'prev' ? numOfDisplayedPages / 2 - 1 : numOfDisplayedPages / 2);
  } else {
    firstPageToDisplay = pageSelected - Math.floor(numOfDisplayedPages / 2);
    lastPageToDisplay = pageSelected + Math.floor(numOfDisplayedPages / 2);
  }
  // recalc first page and last page if they are off limits
  if (firstPageToDisplay <= 0) {
    const offset = pages[0] - firstPageToDisplay;
    firstPageToDisplay = pages[0];
    lastPageToDisplay =
      lastPageToDisplay + offset <= pages[pages.length - 1]
        ? lastPageToDisplay + offset
        : pages[pages.length - 1];
  }
  if (lastPageToDisplay > pages[pages.length - 1]) {
    const offset = lastPageToDisplay - pages[pages.length - 1];
    lastPageToDisplay = pages[pages.length - 1];
    firstPageToDisplay =
      firstPageToDisplay - offset >= pages[0] ? firstPageToDisplay - offset : pages[0];
  }
  // fill pages to display
  const displayedPages: Array<number> = [];
  for (let i = firstPageToDisplay; i <= lastPageToDisplay; i++) {
    /* eslint-disable functional/immutable-data */
    displayedPages.push(i);
  }
  return displayedPages;
}
/**
 * Calcola le pagine per il componente CustomPagination
 * @param  {number} pageSize
 * @param  {number} numOfItems
 * @param  {number} numOfDisplayedPages
 * @param  {number} pageSelected
 * @returns Array
 */
export function calculatePages(
  pageSize: number,
  numOfItems: number,
  numOfDisplayedPages: number,
  pageSelected: number
): Array<number> {
  if (pageSize && numOfItems) {
    const numOfPages = Math.ceil(numOfItems / pageSize);
    const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);
    return calcDisplayedPages(pages, numOfDisplayedPages, pageSelected, 'next');
  }
  return [];
}