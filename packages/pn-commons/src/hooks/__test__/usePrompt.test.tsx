import { Route, Routes, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import { fireEvent, render, waitFor } from '../../test-utils';
import { usePrompt } from '../usePrompt';

const PromptComponent = () => {
  const navigate = useNavigate();
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(true);

  const handleNavigate = () => {
    navigate('/test');
  };

  return (
    <>
      {showPrompt && (
        <Box data-testid="prompt">
          <Box data-testid="cancel" onClick={cancelNavigation}>
            cancel
          </Box>
          <Box data-testid="confirm" onClick={confirmNavigation}>
            confirm
          </Box>
        </Box>
      )}
      prompt component
      <Box onClick={handleNavigate} data-testid="click-me">
        navigate
      </Box>
      <Box onClick={() => navigate('/')} data-testid="stay-here">
        stay here
      </Box>
    </>
  );
};

const Component = () => (
  <Routes>
    <Route path={'/'} element={<PromptComponent />} />
    <Route path={'/test'} element={<div>other</div>} />
  </Routes>
);

describe('test usePrompt hook', () => {
  it('initialization', () => {
    const { queryByTestId } = render(<Component />);
    const prompt = queryByTestId('prompt');
    expect(prompt).not.toBeInTheDocument();
  });

  it('cancel navigation', async () => {
    const { container, getByTestId, router } = render(<Component />);
    expect(router.state.location.pathname).toBe('/');

    const navigateButton = getByTestId('click-me');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => getByTestId('prompt'));
    expect(prompt).toBeInTheDocument();
    const cancelButton = getByTestId('cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(prompt).not.toBeInTheDocument();
      expect(container).toHaveTextContent('prompt component');
      expect(router.state.location.pathname).toBe('/');
    });
  });

  it('confirm navigation', async () => {
    const { getByTestId, container, router } = render(<Component />);
    expect(router.state.location.pathname).toBe('/');

    const navigateButton = getByTestId('click-me');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => getByTestId('prompt'));
    expect(prompt).toBeInTheDocument();
    const confirmButton = getByTestId('confirm');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(prompt).not.toBeInTheDocument();
      expect(container).toHaveTextContent('other');
      expect(router.state.location.pathname).toBe('/test');
    });
  });

  it('try to navigate to the same page', async () => {
    const { getByTestId, queryByTestId, container, router } = render(<Component />);
    expect(router.state.location.pathname).toBe('/');
    const navigateButton = getByTestId('stay-here');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => queryByTestId('prompt'));
    expect(prompt).not.toBeInTheDocument();
    expect(container).toHaveTextContent('prompt component');
    expect(router.state.location.pathname).toBe('/');
  });
});
