import { render } from "@testing-library/react";
import DesktopNotifications from "../DesktopNotifications";

jest.mock('../FilterNotificationsTable', () => () => <div>Filters</div>);
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsTable: () => <div>Table</div>
  }
});

describe('DesktopNotifications Component', () => {

  it('renders DesktopNotifications', () => {
    // render component
    const result = render(<DesktopNotifications notifications={[]} sort={{orderBy: '', order: 'asc'}}/>);
    expect(result.container).toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(/Table/i);
  });
});