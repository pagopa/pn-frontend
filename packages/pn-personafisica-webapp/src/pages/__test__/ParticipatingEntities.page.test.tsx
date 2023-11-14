import React from 'react';
import { vi } from 'vitest';

import { compileOneTrustPath } from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import ParticipatingEntities from '../ParticipatingEntities.page';

describe('test the Participating Entities page', () => {
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

  it('check that Privacy Policy page container is rendered', () => {
    const result = render(<ParticipatingEntities />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([compileOneTrustPath('mocked-id')], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
