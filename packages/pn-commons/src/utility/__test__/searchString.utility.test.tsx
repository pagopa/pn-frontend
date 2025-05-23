import { vi } from 'vitest';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import { searchStringLimitReachedText, useSearchStringChangeInput } from '../searchString.utility';

const setValueMock = vi.fn();

const Component: React.FC = () => {
  const handleSearchStringChangeInput = useSearchStringChangeInput(10);
  return (
    <input
      id="test-input"
      name="test-input"
      onChange={(event) => handleSearchStringChangeInput(event.target.value, setValueMock)}
    />
  );
};

describe('searchString utility', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('should not display a limit text if search string is shorter than maximum length', () => {
    const searchString = 'abcde';
    const maxLength = 10;
    const result = searchStringLimitReachedText(searchString, maxLength);
    expect(result).toBe('');
  });

  it('should display a limit text if search string is greater than maximum length', () => {
    const searchString = 'abcdefghilmnopq';
    const maxLength = 10;
    const result = searchStringLimitReachedText(searchString, maxLength);
    expect(result).toBe(
      ` (common - validation.search-pattern-length-limit - ${JSON.stringify({ maxLength })})`
    );
  });

  it('should clean the search string', () => {
    const { container, testStore } = render(<Component />);
    const input = container.querySelector('input[name="test-input"]');
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: 'ABC∃de' } });
    expect(setValueMock).toHaveBeenCalledWith('ABCde');
    const state = testStore.getState();
    expect(state.appState.messages.errors).toStrictEqual([
      {
        action: undefined,
        alreadyShown: false,
        blocking: false,
        id: '1',
        message: 'common - validation.invalid-characters-not-inserted',
        status: undefined,
        title: 'common - validation.invalid-characters-not-inserted',
        toNotify: true,
        showTechnicalData: false,
        traceId: undefined,
        errorCode: undefined,
      },
    ]);
  });

  it('should limit the search string to the maximum length', () => {
    const { container, testStore } = render(<Component />);
    const input = container.querySelector('input[name="test-input"]');
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: 'abcdefghilmnopqrst' } });
    expect(setValueMock).toHaveBeenCalledWith('abcdefghil');
    const state = testStore.getState();
    expect(state.appState.messages.errors).toStrictEqual([]);
  });

  it('no special characthers and no maximum length exceeded', () => {
    const { container, testStore } = render(<Component />);
    const input = container.querySelector('input[name="test-input"]');
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: 'abcde' } });
    expect(setValueMock).toHaveBeenCalledWith('abcde');
    const state = testStore.getState();
    expect(state.appState.messages.errors).toStrictEqual([]);
  });
});
