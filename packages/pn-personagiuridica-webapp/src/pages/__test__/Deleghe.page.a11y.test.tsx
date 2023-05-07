import React from 'react';
import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/useIsMobile';

import {
  arrayOfDelegates,
  arrayOfDelegators,
} from '../../../../pn-personafisica-webapp/src/redux/delegation/__test__/test.utils';
import { axe, mockApi, render, act, RenderResult } from '../../__test__/test-utils';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
} from '../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import { apiClient } from '../../api/apiClients';
import Deleghe from '../Deleghe.page';

const useIsMobileSpy = jest.spyOn(isMobileHook, 'useIsMobile');

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Deleghe page - accessibility tests', () => {
  afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
  });

  it('is deleghe page accessible - desktop version', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATOR(),
      200,
      undefined,
      arrayOfDelegates
    );
    mockApi(mock, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    mockApi(mock, 'GET', GET_GROUPS(), 200, undefined, []);
    mockApi(mock, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    useIsMobileSpy.mockReturnValue(false);
    const result = render(<Deleghe />);
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - mobile version', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATOR(),
      200,
      undefined,
      arrayOfDelegates
    );
    mockApi(mock, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    mockApi(mock, 'GET', GET_GROUPS(), 200, undefined, []);
    mockApi(mock, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    useIsMobileSpy.mockReturnValue(true);
    const result = render(<Deleghe />);
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
