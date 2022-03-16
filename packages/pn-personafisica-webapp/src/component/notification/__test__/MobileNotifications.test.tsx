import { render } from '../../../__test__/test-utils';
import MobileNotifications from '../MobileNotifications';

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsCard: () => <div>Cards</div>,
  };
});
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));
jest.mock('../MobileNotificationsSort', () => () => <div>Sort</div>);

describe('MobileNotifications Component', () => {

  it('renders MobileNotifications', () => {
    // render component
    const result = render(<MobileNotifications notifications={[]} sort={{orderBy: 'mocked-field', order: 'asc'}} onChangeSorting={() => {}}/>);
    expect(result.container).toHaveTextContent(/Sort/i);
    expect(result.container).toHaveTextContent(/Cards/i);
  });
});
