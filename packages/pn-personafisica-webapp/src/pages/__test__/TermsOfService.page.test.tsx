import { vi } from 'vitest';

import { ConsentType, compileOneTrustPath } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import TermsOfServicePage from '../TermsOfService.page';

describe('TermsOfService page component', () => {
  const loadNoticesFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('render component', () => {
    const result = render(<TermsOfServicePage />);
    expect(loadNoticesFn).toHaveBeenCalledTimes(1);
    expect(loadNoticesFn).toHaveBeenCalledWith([compileOneTrustPath('mocked-id')], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });

  it('render component - SERCQ SEND', () => {
    const result = render(<TermsOfServicePage type={ConsentType.TOS_SERCQ} />);
    expect(loadNoticesFn).toHaveBeenCalledTimes(1);
    expect(loadNoticesFn).toHaveBeenCalledWith(
      [compileOneTrustPath('mocked-id-sercq-send')],
      false
    );
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
