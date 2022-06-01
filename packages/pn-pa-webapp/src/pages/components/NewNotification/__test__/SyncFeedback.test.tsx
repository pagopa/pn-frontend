import { render } from '../../../../__test__/test-utils';
import SyncFeedback from '../SyncFeedback';

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
});
