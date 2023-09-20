import { Matcher, MatcherOptions, queryByAttribute } from '@testing-library/react';

const queryById: (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions
) => HTMLElement | null = (container: HTMLElement, id: Matcher, options?: MatcherOptions) =>
  queryByAttribute('id', container, id, options);

const getById: (container: HTMLElement, id: Matcher, options?: MatcherOptions) => HTMLElement = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions
) => {
  const elem = queryByAttribute('id', container, id, options);
  if (!elem) {
    throw new Error(`cannot find an element with id ${id}`);
  }
  return elem;
};

export * from '@testing-library/react';
export { queryById, getById };
