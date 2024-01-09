import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { arrayOfDelegates, arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
} from '../../api/delegations/delegations.routes';
import Deleghe from '../Deleghe.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Deleghe page - accessibility tests', async () => {
  const original = window.matchMedia;
  let result: RenderResult;
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    window.matchMedia = original;
    mock.restore();
  });

  it('is deleghe page accessible - desktop version - no data', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    await act(async () => {
      result = render(<Deleghe />);
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - mobile version - no data', async () => {
    window.matchMedia = createMatchMedia(800);
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    await act(async () => {
      result = render(<Deleghe />);
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - desktop version - with data', async () => {
    window.matchMedia = createMatchMedia(2000);
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Deleghe />);
    });
    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('is deleghe page accessible - mobile version - with data', async () => {
    window.matchMedia = createMatchMedia(800);
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Deleghe />);
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
