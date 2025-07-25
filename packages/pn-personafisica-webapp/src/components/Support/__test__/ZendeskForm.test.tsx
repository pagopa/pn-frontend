import { vi } from 'vitest';

import { disableConsoleLogging } from '@pagopa-pn/pn-commons/src/test-utils';

import { render, testStore } from '../../../__test__/test-utils';
import ZendeskForm from '../ZendeskForm';

describe('ZendeskForm', () => {
  const submitMock = vi.fn();
  const originalSubmit = HTMLFormElement.prototype.submit;

  disableConsoleLogging('error');

  beforeAll(() => {
    Object.defineProperty(HTMLFormElement.prototype, 'submit', {
      configurable: true,
      value: submitMock,
    });
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(HTMLFormElement.prototype, 'submit', {
      configurable: true,
      value: originalSubmit,
    });
  });

  it('should render hidden form inputs correctly', () => {
    const props = {
      data: {
        action_url: 'https://action.pagopa.it',
        jwt: 'mock-jwt',
        return_to: 'https://return.pagopa.it',
      },
    };

    const { container } = render(<ZendeskForm {...props} />);
    const form = container.querySelector('form')!;
    const jwtInput = container.querySelector('input[name="jwt"]')!;
    const returnToInput = container.querySelector('input[name="return_to"]')!;

    expect(form).toHaveAttribute('action', props.data.action_url);
    expect(jwtInput).toHaveAttribute('value', props.data.jwt);
    expect(returnToInput).toHaveAttribute('value', props.data.return_to);
  });

  it('should auto-submit the form if all data is present', () => {
    render(
      <ZendeskForm
        data={{
          action_url: 'https://action.pagopa.it',
          jwt: 'mock-jwt',
          return_to: 'https://return.pagopa.it',
        }}
      />
    );

    expect(submitMock).toHaveBeenCalled();
  });

  it('should dispatch error if form.submit throws', () => {
    submitMock.mockImplementation(() => {
      throw new Error('submit failed');
    });

    render(
      <ZendeskForm
        data={{
          action_url: 'https://action.pagopa.it',
          jwt: 'mock-jwt',
          return_to: 'https://return.pagopa.it',
        }}
      />
    );

    const state = testStore.getState();
    expect(state.appState.messages.errors).toHaveLength(1);
    expect(state.appState.messages.errors[0]).toMatchObject({
      title: 'messages.generic-title',
      message: 'messages.generic-message',
      showTechnicalData: false,
    });

    expect(state.appState.lastError).toBeUndefined();
  });
});
