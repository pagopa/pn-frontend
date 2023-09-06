import { shuffleList } from '../utils';

const list: Array<any> = [1, 2, 3, 4, 5, 6];

describe('util test', () => {
  it('shuffle test', () => {
    const shuffledList = shuffleList([...list]);
    expect(list).not.toEqual(shuffledList);
  });
});
