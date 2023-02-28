import React from 'react';
import { render } from '../../__test__/test-utils';

import TermsOfServicePage from '../TermsOfService.page';
import { compileOneTrustPath } from '@pagopa-pn/pn-commons';

jest.mock('../../utils/constants', () => {
  return {
    ...jest.requireActual('../../utils/constants'),
    ONE_TRUST_TOS: 'mocked-id',
    ONE_TRUST_DRAFT_MODE: false,
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
    expect(loadNoticesFn).toBeCalledWith([compileOneTrustPath('mocked-id')], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
