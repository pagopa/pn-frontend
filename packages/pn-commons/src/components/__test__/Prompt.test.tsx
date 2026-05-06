import { Route, Routes, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import { fireEvent, render, waitFor, within } from '../../test-utils';
import Prompt from '../Prompt';

interface PromptProps {
  disabled?: boolean;
}

const WrappedPrompt: React.FC<PromptProps> = ({ disabled = false }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/test');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Prompt disabled={disabled} title={'Test title'} message={'Test subtitle'}>
            <Box onClick={handleNavigate}>navigate</Box>
          </Prompt>
        }
      />
      <Route path="/test" element={<Box>other</Box>} />
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

  it('opens the prompt and then closes it', async () => {
    const result = render(<WrappedPrompt />);

    const navigateButton = result.getByText('navigate');
    fireEvent.click(navigateButton);
    let dialog = result.getByTestId('promptDialog');
    expect(dialog).toBeInTheDocument();

    const cancelButton = within(dialog).getByText(/button.annulla/i);
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(result.router.state.location.pathname).toBe('/');
    });

    fireEvent.click(navigateButton);
    dialog = result.getByTestId('promptDialog');
    const exitButton = within(dialog).getByText(/button.exit/i);
    fireEvent.click(exitButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe('/test');
      expect(result.baseElement).toHaveTextContent(/other/i);
    });
  });

  it('renders the prompt disabled', () => {
    const result = render(<WrappedPrompt disabled />);

    const navigateButton = result.getByText('navigate');
    fireEvent.click(navigateButton);

    const dialog = result.queryByTestId('promptDialog');
    expect(dialog).not.toBeInTheDocument();
    expect(result.baseElement).toHaveTextContent(/other/i);
  });
});
