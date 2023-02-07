import React from 'react';
import { render } from '@testing-library/react';
import ParticipatingEntities from '../ParticipatingEntities.page';
import { ONE_TRUST_BASEPATH } from '@pagopa-pn/pn-commons/src/utils/onetrust.utility';

jest.mock('../../utils/constants', () => {
  return {
    ...jest.requireActual('../../utils/constants'),
    ONE_TRUST_PARTICIPATING_ENTITIES: 'mocked-id',
  };
});

describe('test the Participating Entities page', () => {
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
    const result = render(<ParticipatingEntities />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([`${ONE_TRUST_BASEPATH}/mocked-id.json`], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});