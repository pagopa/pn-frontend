import { mock1 } from './statistics.mock-1';
import { mock2 } from './statistics.mock-2';
import { mock3 } from './statistics.mock-3';
import { mock4 } from './statistics.mock-4';

const mocks = [mock1, mock2, mock3, mock4, null];

const random = Math.floor(Math.random() * 5);

export const statisticsMockResponse = mocks[random];
