import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import DigitalContactsCard from '../DigitalContactsCard';

const header = 'Mocked header';
const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const body = <div data-testid="body">Body</div>;

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

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
});
