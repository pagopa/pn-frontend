import { fireEvent, render } from '../../../../__test__/test-utils';
import SyncFeedbackApiKey from '../SyncFeedbackApiKey';

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

describe('SyncFeedbackApiKey Component', () => {
  it('renders SyncFeedback', () => {
    // render component
    const result = render(<SyncFeedbackApiKey />);
    expect(result.container).toHaveTextContent('api-key-succesfully-generated');
    expect(result.container).toHaveTextContent('copy-the-api-key');
    const button = result.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('go-to-api-keys');
  });

  it('navigate to api keys', () => {
    // render component
    const result = render(<SyncFeedbackApiKey />);
    const button = result.container.querySelector('button');
    fireEvent.click(button!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });
});
