import React from 'react';
import { render } from '../../__test__/test-utils';

import { compileOneTrustPath } from '@pagopa-pn/pn-commons';
import TermsOfServicePage from '../TermsOfService.page';

jest.mock('../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../services/configuration.service'),
    getConfiguration: () => (
      { ONE_TRUST_DRAFT_MODE: false, ONE_TRUST_TOS: 'mocked-id' }
    ),
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
