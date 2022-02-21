import { calcPages } from '../pages.utility';

test('calculate 5 displayed pages for 100 items, 10 items per page and page 1', () => {
  const displayedPages = calcPages(10, 100, 5, 1);
  expect(displayedPages).toEqual([1, 2, 3, 4, 5]);
});

test('calculate 5 displayed pages for 100 items, 10 items per page and page 6', () => {
  const displayedPages = calcPages(10, 100, 5, 6);
  expect(displayedPages).toEqual([4, 5, 6, 7, 8]);
});

test('calculate 5 displayed pages for 100 items, 10 items per page and page 10', () => {
  const displayedPages = calcPages(10, 100, 5, 10);
  expect(displayedPages).toEqual([6, 7, 8, 9, 10]);
});

test('calculate 4 displayed pages for 100 items, 10 items per page and page 1', () => {
  const displayedPages = calcPages(10, 100, 4, 1);
  expect(displayedPages).toEqual([1, 2, 3, 4]);
});

test('calculate 4 displayed pages for 100 items, 10 items per page and page 6', () => {
  const displayedPages = calcPages(10, 100, 4, 6);
  expect(displayedPages).toEqual([5, 6, 7, 8]);
});

test('calculate 4 displayed pages for 100 items, 10 items per page and page 10', () => {
  const displayedPages = calcPages(10, 100, 4, 10);
  expect(displayedPages).toEqual([7, 8, 9, 10]);
});