import React from 'react';
import { render } from '@testing-library/react';
import PrivacyPolicyPage from '../PrivacyPolicy.page';
import { ONE_TRUST_PORTAL_CDN_PP } from '../../utils/constants';

jest.mock('../../utils/constants', () => {
  return {
    ...jest.requireActual('../../utils/constants'),
    ONE_TRUST_PORTAL_CDN_PP: 'mocked-url',
  };
});

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
    const result = render(<PrivacyPolicyPage />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([ONE_TRUST_PORTAL_CDN_PP], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
