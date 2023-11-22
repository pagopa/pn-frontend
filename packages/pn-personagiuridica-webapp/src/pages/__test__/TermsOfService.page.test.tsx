import React from 'react';
import { vi } from 'vitest';

import { compileOneTrustPath } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import TermsOfServicePage from '../TermsOfService.page';

describe('TermsOfService page component', () => {
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

  it('render component', () => {
    const result = render(<TermsOfServicePage />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([compileOneTrustPath('mocked-id')], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
