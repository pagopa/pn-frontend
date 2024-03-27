import { Route, Routes, useNavigate } from 'react-router-dom';

import { fireEvent, render } from '../../test-utils';
import Prompt from '../Prompt';

const WrappedPrompt = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/test');
  };

  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <Prompt title={'Test title'} message={'Test subtitle'}>
            <div onClick={handleNavigate}>navigate</div>
          </Prompt>
        }
      />
      <Route path={'/test'} element={<div>other</div>} />
    </Routes>
  );
};

describe('test Prompt component', () => {
  it('renders the prompt closed, then opens it', () => {
    const result = render(<WrappedPrompt />);
    const navigateButton = result.getByText('navigate');

    expect(result.baseElement).not.toHaveTextContent(/test title/i);
    expect(result.baseElement).not.toHaveTextContent(/test subtitle/i);
    expect(result.baseElement).toHaveTextContent(/navigate/i);

    fireEvent.click(navigateButton);

    expect(result.baseElement).toHaveTextContent(/test title/i);
    expect(result.baseElement).toHaveTextContent(/test subtitle/i);
  });

  it('opens the prompt and then closes it', () => {
    const result = render(<WrappedPrompt />);

    const navigateButton = result.getByText('navigate');

    fireEvent.click(navigateButton);

    expect(result.baseElement).toHaveTextContent(/test title/i);

    const cancelButton = result.getByText(/annulla/i);

    fireEvent.click(cancelButton);
    expect(result.baseElement).toHaveTextContent(/test title/i);

    const exitButton = result.getByText(/esci/i);

    fireEvent.click(exitButton);

    expect(result.baseElement).not.toHaveTextContent(/test title/i);
    expect(result.baseElement).toHaveTextContent(/other/i);
  });
});
