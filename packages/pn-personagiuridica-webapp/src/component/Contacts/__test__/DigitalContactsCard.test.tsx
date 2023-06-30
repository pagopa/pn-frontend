import { axe, render } from '../../../__test__/test-utils';
import DigitalContactsCard from '../DigitalContactsCard';

const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const actions = <button>Click me</button>;
const body = <div data-testid="body">Body</div>;

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DigitalContactsCard Component', () => {
  it('renders DigitalContactsCard', () => {
    // render component
    const result = render(
      <DigitalContactsCard
        sectionTitle={'mocked-sectionTitle'}
        title={title}
        subtitle={subTitle}
        actions={actions}
        avatar="avatar"
      >
        {body}
      </DigitalContactsCard>
    );
    const titleEl = result.container.querySelector('h6');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(result.container).toHaveTextContent(subTitle);
    const bodyEl = result.queryByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    const buttonEl = result.container.querySelector('button');
    expect(buttonEl).toBeInTheDocument();
    expect(buttonEl).toHaveTextContent(/Click me/i);
  });
});
