import { render } from '../../../__test__/test-utils';
import DesktopNotifications from '../DesktopNotifications';

jest.mock('../FilterNotifications', () => () => <div>Filters</div>);
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsTable: () => <div>Table</div>,
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

describe('DesktopNotifications Component', () => {
  it('renders DesktopNotifications', () => {
    // render component
    const result = render(
      <DesktopNotifications notifications={[]} sort={{ orderBy: '', order: 'asc' }} />
    );
    expect(result.container).toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(/Table/i);
  });
});
