export const shuffleList = <T,>(list: Array<T>) => {
  // eslint-disable-next-line functional/no-let
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line functional/immutable-data
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

export const isIOSMobile = (): boolean =>
  /iPhone|iPod|iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
