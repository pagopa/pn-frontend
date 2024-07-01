/* eslint-disable functional/immutable-data */
import { Options } from './types';

export function applyStyle<T extends HTMLElement>(node: T, options: Options): T {
  const { style } = node;

  if (options.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }

  return node;
}
