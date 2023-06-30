import { axe } from '../../__test__/test-utils';
import { doPrepareTestScenario } from './Notifiche.page.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('Notifiche Page - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    const { result } = await doPrepareTestScenario();
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);
});
