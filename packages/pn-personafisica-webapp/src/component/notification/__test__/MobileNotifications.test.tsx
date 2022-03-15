import { render } from "../../../__test__/test-utils";
import MobileNotifications from "../MobileNotifications";

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsCard: () => <div>Cards</div>
  }
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
    const result = render(<MobileNotifications notifications={[]}/>);
    expect(result.container).toHaveTextContent(/Cards/i);
  });
});