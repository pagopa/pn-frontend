import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import DigitalContactsCard from '../DigitalContactsCard';

const header = 'Mocked header';
const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const body = <div data-testid="body">Body</div>;

describe('DigitalContactsCard Component', () => {
  it('renders component', () => {
    // render component
    const { container, getByTestId, queryByTestId } = render(
      <DigitalContactsCard title={title} subtitle={subTitle}>
        {body}
      </DigitalContactsCard>
    );
    const titleEl = getByTestId('DigitalContactsCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    const headerEl = queryByTestId('DigitalContactsCardHeader');
    expect(headerEl).not.toBeInTheDocument();
  });

  it('renders component - with header', () => {
    // render component
    const { container, getByTestId } = render(
      <DigitalContactsCard header={header} title={title} subtitle={subTitle}>
        {body}
      </DigitalContactsCard>
    );
    const titleEl = getByTestId('DigitalContactsCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    const headerEl = getByTestId('DigitalContactsCardHeader');
    expect(headerEl).toBeInTheDocument();
  });

  it('renders component - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    const { container, getByTestId } = render(
      <DigitalContactsCard title={title} subtitle={subTitle}>
        {body}
      </DigitalContactsCard>
    );
    const titleEl = getByTestId('DigitalContactsCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).not.toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    // check if collapsed description is shown
    let collapseIcon = getByTestId('KeyboardArrowDownOutlinedIcon');
    expect(collapseIcon).toBeInTheDocument();
    fireEvent.click(collapseIcon);
    await waitFor(() => expect(container).toHaveTextContent(subTitle));
    expect(collapseIcon).not.toBeInTheDocument();
    collapseIcon = getByTestId('KeyboardArrowUpOutlinedIcon');
    expect(collapseIcon).toBeInTheDocument();
  });
});
