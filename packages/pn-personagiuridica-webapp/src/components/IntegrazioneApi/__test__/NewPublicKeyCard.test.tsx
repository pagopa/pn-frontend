import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import NewPublicKeyCard from '../NewPublicKey/NewPublicKeyCard';

const handleContinueMk = vi.fn();
const handleBackMk = vi.fn();

describe('NewPublicKeyCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component', () => {
    const { container, getByTestId } = render(
      <NewPublicKeyCard
        title="title"
        content="content"
        isContinueDisabled={false}
        onContinueClick={handleContinueMk}
        previousStepLabel="Previous button"
        onBackClick={handleBackMk}
      >
        <p>Mocked child</p>
      </NewPublicKeyCard>
    );

    expect(container).toHaveTextContent('title');
    expect(container).toHaveTextContent('content');
    expect(container).toHaveTextContent('Mocked child');
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent('button.end');
    fireEvent.click(submitButton);
    expect(handleContinueMk).toHaveBeenCalledTimes(1);
    const preveiousButton = getByTestId('previous-step');
    expect(preveiousButton).toBeInTheDocument();
    expect(preveiousButton).toHaveTextContent('Previous button');
    fireEvent.click(preveiousButton);
    expect(handleBackMk).toHaveBeenCalledTimes(1);
  });

  it('render component with custom submit label', () => {
    const { getByTestId } = render(
      <NewPublicKeyCard
        title="title"
        content="content"
        isContinueDisabled={false}
        onContinueClick={handleContinueMk}
        submitLabel="Submit button"
      >
        <p>Mocked child</p>
      </NewPublicKeyCard>
    );

    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent('Submit button');
    fireEvent.click(submitButton);
    expect(handleContinueMk).toHaveBeenCalledTimes(1);
  });

  it('render component with submit button disabled', () => {
    const { getByTestId } = render(
      <NewPublicKeyCard
        title="title"
        content="content"
        isContinueDisabled={true}
        onContinueClick={handleContinueMk}
      >
        <p>Mocked child</p>
      </NewPublicKeyCard>
    );

    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);
    expect(handleContinueMk).toHaveBeenCalledTimes(0);
  });

  it('render component without previous button', () => {
    const { queryByTestId } = render(
      <NewPublicKeyCard
        title="title"
        content="content"
        isContinueDisabled={false}
        onContinueClick={handleContinueMk}
      >
        <p>Mocked child</p>
      </NewPublicKeyCard>
    );

    const preveiousButton = queryByTestId('previous-step');
    expect(preveiousButton).not.toBeInTheDocument();
  });
});
