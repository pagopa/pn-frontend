import { render } from '../../test-utils';
import TabPanel from '../TabPanel';

describe('test TabPanel component', () => {
  it('renders the full component', () => {
    const { container } = render(
      <>
        <TabPanel index={0} value={1}>
          First content
        </TabPanel>
        <TabPanel index={1} value={1}>
          Second content
        </TabPanel>
      </>
    );
    expect(container).not.toHaveTextContent(/First content/i);
    expect(container).toHaveTextContent(/Second content/i);
  });
});
