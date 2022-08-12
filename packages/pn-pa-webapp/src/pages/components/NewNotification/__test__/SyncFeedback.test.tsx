import { fireEvent, render } from '../../../../__test__/test-utils';
import SyncFeedback from '../SyncFeedback';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('SyncFeedback Component', () => {
  it('renders SyncFeedback', () => {
    // render component
    const result = render(<SyncFeedback />);
    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('message');
    const button = result.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('go-to-notifications');
  });

  it('navigate to notifications', () => {
    // render component
    const result = render(<SyncFeedback />);
    const button = result.container.querySelector('button');
    fireEvent.click(button!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });
});
