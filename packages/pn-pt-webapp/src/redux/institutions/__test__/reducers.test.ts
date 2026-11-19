import { vi } from 'vitest';

import { getInstitutionsResponse } from '../../../__mocks__/Institutions.mock';
import { InstitutionsApi } from '../../../api/institutions/Institutions.api';
import { InstitutionsResponse } from '../../../models/Institutions';
import { store } from '../../store';
import { getInstitutions } from '../actions';
import { resetState, setPagination, setSearch } from '../reducers';

const initialState = {
  institutions: {
    items: [],
  } as InstitutionsResponse,
  search: '',
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
  },
};

describe('institutions redux state tests', () => {
  const getInstitutionsSpy = vi.spyOn(InstitutionsApi, 'getInstitutions');

  afterEach(() => {
    getInstitutionsSpy.mockReset();
    store.dispatch(resetState());
  });

  afterAll(() => {
    getInstitutionsSpy.mockRestore();
  });

  it('initial state', () => {
    expect(store.getState().institutionsState).toEqual(initialState);
  });

  it('should be able to fetch the institutions and store the next page key', async () => {
    const params = { search: 'Fittizio', limit: 10 };
    const response = getInstitutionsResponse(params);
    getInstitutionsSpy.mockResolvedValueOnce(response);
    const action = await store.dispatch(getInstitutions(params));
    expect(getInstitutionsSpy).toHaveBeenCalledWith(params);
    expect(action.type).toBe('getInstitutions/fulfilled');
    expect(action.payload).toEqual(response);
    const state = store.getState().institutionsState;
    expect(state.institutions).toStrictEqual(response);
    expect(state.pagination.nextPagesKey).toEqual(['10']);

    // the same key is not stored twice
    getInstitutionsSpy.mockResolvedValueOnce(response);
    await store.dispatch(getInstitutions(params));
    expect(store.getState().institutionsState.pagination.nextPagesKey).toEqual(['10']);
  });

  it('should not store a key for the last page', async () => {
    const response = getInstitutionsResponse({ limit: 10, lastKey: '20' });
    getInstitutionsSpy.mockResolvedValueOnce(response);
    await store.dispatch(getInstitutions({ limit: 10, lastKey: '20' }));
    expect(response.lastKey).toBeUndefined();
    expect(store.getState().institutionsState.pagination.nextPagesKey).toEqual([]);
  });

  it('should keep the previous state if the fetch fails', async () => {
    getInstitutionsSpy.mockRejectedValueOnce({ response: { status: 500, data: {} } });
    const action = await store.dispatch(getInstitutions({ limit: 10 }));
    expect(action.type).toBe('getInstitutions/rejected');
    expect(action.payload).toEqual({ response: { status: 500, data: { traceId: '' } } });
    expect(store.getState().institutionsState).toEqual(initialState);
  });

  it('should change page and reset the keys when the size changes', async () => {
    getInstitutionsSpy.mockResolvedValueOnce(getInstitutionsResponse({ limit: 10 }));
    await store.dispatch(getInstitutions({ limit: 10 }));

    store.dispatch(setPagination({ page: 1, size: 10 }));
    expect(store.getState().institutionsState.pagination).toEqual({
      page: 1,
      size: 10,
      nextPagesKey: ['10'],
    });

    const action = store.dispatch(setPagination({ page: 0, size: 20 }));
    expect(action.type).toBe('institutionsSlice/setPagination');
    expect(store.getState().institutionsState.pagination).toEqual({
      page: 0,
      size: 20,
      nextPagesKey: [],
    });
  });

  it('should set the search and reset the pagination', async () => {
    getInstitutionsSpy.mockResolvedValueOnce(getInstitutionsResponse({ limit: 10 }));
    await store.dispatch(getInstitutions({ limit: 10 }));
    store.dispatch(setPagination({ page: 1, size: 10 }));

    const action = store.dispatch(setSearch('Fittizio'));
    expect(action.type).toBe('institutionsSlice/setSearch');
    const state = store.getState().institutionsState;
    expect(state.search).toBe('Fittizio');
    expect(state.pagination).toEqual({ page: 0, size: 10, nextPagesKey: [] });
  });

  it('should keep the pagination keys when the same search is set on the first page', async () => {
    store.dispatch(setSearch('Fittizio'));
    getInstitutionsSpy.mockResolvedValueOnce(getInstitutionsResponse({ limit: 10 }));
    await store.dispatch(getInstitutions({ search: 'Fittizio', limit: 10 }));

    store.dispatch(setSearch('Fittizio'));
    expect(store.getState().institutionsState.pagination).toEqual({
      page: 0,
      size: 10,
      nextPagesKey: ['10'],
    });
  });

  it('should reset the pagination when the same search is set on another page', async () => {
    store.dispatch(setSearch('Fittizio'));
    getInstitutionsSpy.mockResolvedValueOnce(getInstitutionsResponse({ limit: 10 }));
    await store.dispatch(getInstitutions({ search: 'Fittizio', limit: 10 }));
    store.dispatch(setPagination({ page: 1, size: 10 }));

    store.dispatch(setSearch('Fittizio'));
    expect(store.getState().institutionsState.pagination).toEqual({
      page: 0,
      size: 10,
      nextPagesKey: [],
    });
  });

  it('should reset the state', async () => {
    getInstitutionsSpy.mockResolvedValueOnce(getInstitutionsResponse({ limit: 10 }));
    await store.dispatch(getInstitutions({ limit: 10 }));
    const action = store.dispatch(resetState());
    expect(action.type).toBe('institutionsSlice/resetState');
    expect(store.getState().institutionsState).toEqual(initialState);
  });
});
