import { v4 as uuidv4 } from 'uuid';

export const shuffleList = (list: Array<any>) => {
  // eslint-disable-next-line functional/no-let
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line functional/immutable-data
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

export const generateRandomUniqueString = () => uuidv4().replace(/-/g, '').slice(0, 20);

export const isIOSMobile = (): boolean => /iPhone|iPod|iPad/.test(navigator.userAgent);
