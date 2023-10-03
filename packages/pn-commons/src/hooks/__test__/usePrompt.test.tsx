import React from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { waitFor } from '@testing-library/react';

import { fireEvent, render } from '../../test-utils';
import { usePrompt } from '../usePrompt';

const mockConfirm = jest.fn();
const mockCancel = jest.fn();

const PromptComponent = () => {
  const navigate = useNavigate();
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(
    true,
    mockCancel,
    mockConfirm
  );

  const handleNavigate = () => {
    navigate('/test');
  };

  return (
    <>
      {showPrompt && (
        <div data-testid="prompt">
          <div data-testid="cancel" onClick={cancelNavigation}>
            cancel
          </div>
          <div data-testid="confirm" onClick={confirmNavigation}>
            confirm
          </div>
        </div>
      )}
      prompt component
      <div onClick={handleNavigate} data-testid="click-me">
        navigate
      </div>
      <div onClick={() => navigate('/')} data-testid="stay-here">
        stay here
      </div>
    </>
  );
};

const Component = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path={'/'} element={<PromptComponent />} />
        <Route path={'/test'} element={<div>other</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('test usePrompt hook', () => {
  it('initialization', () => {
    const { queryByTestId } = render(<Component />, { navigationRouter: 'none' });
    const prompt = queryByTestId('prompt');
    expect(prompt).not.toBeInTheDocument();
  });

  it('cancel navigation', async () => {
    const { container, getByTestId } = render(<Component />, { navigationRouter: 'none' });
    const navigateButton = getByTestId('click-me');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => getByTestId('prompt'));
    expect(prompt).toBeInTheDocument();
    const cancelButton = getByTestId('cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(prompt).not.toBeInTheDocument();
      expect(mockCancel).toBeCalledTimes(1);
      expect(container).toHaveTextContent('prompt component');
    });
  });

  it('confirm navigation', async () => {
    const { getByTestId, container } = render(<Component />, { navigationRouter: 'none' });
    const navigateButton = getByTestId('click-me');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => getByTestId('prompt'));
    expect(prompt).toBeInTheDocument();
    const confirmButton = getByTestId('confirm');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(prompt).not.toBeInTheDocument();
      expect(mockConfirm).toBeCalledTimes(1);
      expect(container).toHaveTextContent('other');
    });
  });

  it('try to navigate to the same page', async () => {
    const { getByTestId, queryByTestId, container } = render(<Component />, {
      navigationRouter: 'none',
    });
    const navigateButton = getByTestId('stay-here');
    fireEvent.click(navigateButton);
    const prompt = await waitFor(() => queryByTestId('prompt'));
    expect(prompt).not.toBeInTheDocument();
    expect(container).toHaveTextContent('prompt component');
  });
});
