import React from 'react';
import { vi } from 'vitest';

import { compileOneTrustPath } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import PrivacyPolicy from '../PrivacyPolicy';

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
    const { ONE_TRUST_DRAFT_MODE, ONE_TRUST_PP } = getConfiguration();
    const result = render(<PrivacyPolicy />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith(
      [compileOneTrustPath(ONE_TRUST_PP, ONE_TRUST_DRAFT_MODE)],
      false
    );
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
