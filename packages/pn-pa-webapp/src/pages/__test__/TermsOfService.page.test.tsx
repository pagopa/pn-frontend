import React from 'react';
import { render } from "../../__test__/test-utils";

import { ONE_TRUST_PORTAL_CDN_TOS } from '../../utils/constants';
import TermsOfServicePage from '../TermsOfService.page';

jest.mock('../../utils/constants', () => {
  return {
    ...jest.requireActual('../../utils/constants'),
    ONE_TRUST_PORTAL_CDN_TOS: 'mocked-url',
  };
});

describe('TermsOfService page component', () => {

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

  test('render component', () => {
    const result = render(<TermsOfServicePage />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([ONE_TRUST_PORTAL_CDN_TOS], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});