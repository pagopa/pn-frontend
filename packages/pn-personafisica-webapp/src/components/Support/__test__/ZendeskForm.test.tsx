import { vi } from 'vitest';

import { appStateActions } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import ZendeskForm from '../ZendeskForm';

// mocks redux dispatch
const mockDispatch = vi.fn();
vi.mock('../../../redux/hooks', async () => {
  const mod = await vi.importActual<typeof import('../../../redux/hooks')>('../../../redux/hooks');
  return {
    ...mod,
    useAppDispatch: () => mockDispatch,
  };
});

describe('ZendeskForm', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    const submitMock = vi.fn();
    const createElement = document.createElement.bind(document);

    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'jwtForm') {
        const form = createElement('form');
        form.submit = submitMock;
        return form;
      }
      return null;
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

    expect(submitMock).toHaveBeenCalled();
  });

  it('should dispatch error if form.submit throws', () => {
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'jwtForm') {
        const form = document.createElement('form');
        form.submit = () => {
          throw new Error('submit failed');
        };
        return form;
      }
      return null;
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

    expect(mockDispatch).toHaveBeenCalledWith(
      appStateActions.addError({
        title: 'messages.generic-title',
        message: 'messages.generic-message',
        showTechnicalData: false,
      })
    );
  });
});
