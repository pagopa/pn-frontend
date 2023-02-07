import { ONE_TRUST_BASEPATH } from '@pagopa-pn/pn-commons/src/utils/onetrust.utility';
import { render } from '@testing-library/react';

import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('../../../utils/constants', () => {
  return {
    ...jest.requireActual('../../../utils/constants'),
    ONE_TRUST_PP: 'mocked-id',
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
    const result = render(<PrivacyPolicy />);
    expect(loadNoticesFn).toBeCalledTimes(1);
    expect(loadNoticesFn).toBeCalledWith([`${ONE_TRUST_BASEPATH}/mocked-id.json`], false);
    expect(result.getByRole('article')).toBeInTheDocument();
  });
});
