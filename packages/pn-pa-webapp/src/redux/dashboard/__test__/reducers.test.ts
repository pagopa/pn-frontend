import { tenYearsAgo, today } from '../../../utils/date.utility';
import { store } from '../../store';

describe('Dashbaord redux state tests', () => {
  
  it('Initial state', () => {
    const state = store.getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        recipientId: '',
        status: '',
        subjectRegExp: '',
      },
      pagination: {
        nextPagesKey: [],
        size: 0,
        page: 0,
        moreResult: false,
      },
      sort: {
        orderBy: '',
        order: 'asc' as 'asc' | 'desc',
      },
    });
  });

  /*
  it('Should be able to fetch the games list for a specific user', async () => {
    const result = await store.dispatch(fetchGamesSummary(userId))
    const games = result.payload

    expect(result.type).toBe('games/fetch_list/fulfilled')
    expect(games.game_1).toEqual(getListResponse.game_1)

    const state = store.getState().games
    expect(state).toEqual({ games })
  })
  */
});
