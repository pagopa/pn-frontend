import { render } from '@testing-library/react';

import { ONE_TRUST_PORTAL_CDN } from '../../../utils/constants';
import PrivacyPolicy from '../PrivacyPolicy';

describe('test the Privacy Policy page', () => {
  const loadNoticesFn = jest.fn();

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

  test('check that Privacy Policy page container is rendered', () => {
    const result = render(<PrivacyPolicy />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([ONE_TRUST_PORTAL_CDN], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
