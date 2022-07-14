import { fireEvent, render } from '../../../../__test__/test-utils';
import SyncFeedback from '../SyncFeedback';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('SyncFeedback Component', () => {
  it('renders SyncFeedback', () => {
    // render component
    const result = render(<SyncFeedback />);
    expect(result.container).toHaveTextContent('La notifica è stata correttamente creata');
    expect(result.container).toHaveTextContent(
      'Trovi gli aggiornamenti sul suo stato nella sezione "Notifiche"'
    );
    const button = result.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Vai alle Notifiche');
  });

  it('navigate to notifications', () => {
    // render component
    const result = render(<SyncFeedback />);
    const button = result.container.querySelector('button');
    fireEvent.click(button!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });
});
