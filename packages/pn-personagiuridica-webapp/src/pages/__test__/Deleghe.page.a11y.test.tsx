import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { userResponse } from '../../__mocks__/Auth.mock';
import { arrayOfDelegates, arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
} from '../../api/delegations/delegations.routes';
import Deleghe from '../Deleghe.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Deleghe page - accessibility tests', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('is deleghe page accessible - no data', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    await act(async () => {
      result = render(<Deleghe />, { preloadedState: { userState: { user: userResponse } } });
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - with data', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    await act(async () => {
      result = render(<Deleghe />, { preloadedState: { userState: { user: userResponse } } });
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - with data and user with groups', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    await act(async () => {
      result = render(<Deleghe />, {
        preloadedState: { userState: { user: { ...userResponse, hasGroup: true } } },
      });
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
