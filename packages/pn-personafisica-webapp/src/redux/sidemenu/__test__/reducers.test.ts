import { mockAuthentication } from "../../auth/__test__/reducers.test";
import { store } from "../../store";
import { closeDomicileBanner } from "../actions";

const initialState = {
  pendingDelegators: 0,
  delegators: [],
  legalDomicile: [],
  domicileBannerOpened: true
};

describe('Sidemenu redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().generalInfoState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to close domicile banner', () => {
    const action = store.dispatch(closeDomicileBanner());
    expect(action.type).toBe('closeDomicileBanner');
    const state = store.getState().generalInfoState;
    expect(state).toEqual({...initialState, domicileBannerOpened: false});
  });
});
