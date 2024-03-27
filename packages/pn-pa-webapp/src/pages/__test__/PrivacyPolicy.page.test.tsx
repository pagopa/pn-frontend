import { vi } from 'vitest';

import { compileOneTrustPath } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import PrivacyPolicyPage from '../PrivacyPolicy.page';

vi.mock('../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../services/configuration.service')),
    getConfiguration: () => ({
      ONE_TRUST_DRAFT_MODE: false,
      ONE_TRUST_PP: 'mocked-id',
    }),
  };
});

describe('test the Privacy Policy page', () => {
  const loadNoticesFn = vi.fn();

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.OneTrust = {
      NoticeApi: {
        Initialized: {
          then: (cbk: () => void) => {
            cbk();
          },
        },
        LoadNotices: loadNoticesFn,
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('check that Privacy Policy page container is rendered', () => {
    const result = render(<PrivacyPolicyPage />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([compileOneTrustPath('mocked-id')], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
