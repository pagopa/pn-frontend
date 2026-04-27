import { vi } from 'vitest';

import { act, fireEvent, render } from '../../../../__test__/test-utils';
import PecStep from '../PecStep';

describe('PecStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.pec';
  const mockPec = 'test@pec.mock.pagopa.it';

  const createProps = () => ({
    pec: {
      value: undefined,
      alreadySet: false,
      isValid: undefined,
    },
    email: {
      value: undefined,
      alreadySet: false,
    },
    showOptionalEmail: false,
    onPecChange: vi.fn(),
    onEmailChange: vi.fn(),
    onShowOptionalEmail: vi.fn(),
    registerContinueHandler: vi.fn(),
  });

  it('renders the PEC entry state with disclaimer checkbox when no PEC is present', () => {
    const props = createProps();

    const { getByText, getByLabelText, getByRole } = render(<PecStep {...props} />);

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.label-choose-address`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.verify-cta` })).toBeInTheDocument();

    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.disclaimer`)).toBeInTheDocument();
  });

  it('renders the PEC readonly summary when a validated PEC is already present', () => {
    const props = createProps();

    const { getByText, queryByRole, queryByText } = render(
      <PecStep
        {...props}
        pec={{
          value: mockPec,
          alreadySet: true,
          isValid: true,
        }}
      />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.label-summary`)).toBeInTheDocument();
    expect(getByText(mockPec)).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.pending.title`)).not.toBeInTheDocument();
    expect(queryByRole('button', { name: `${labelPrefix}.verify-cta` })).not.toBeInTheDocument();
  });

  it('shows the disclaimer validation error when the user tries to verify a new PEC without accepting it', async () => {
    const props = createProps();

    const { findByText, getByLabelText, getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    expect(await findByText('required-field')).toBeInTheDocument();
    expect(props.onPecChange).not.toHaveBeenCalled();
  });

  it('renders the PEC pending content when the PEC is in activation and value is not available', () => {
    const props = createProps();

    const { getByText, queryByRole, queryByText } = render(
      <PecStep
        {...props}
        pec={{
          value: undefined,
          alreadySet: false,
          isValid: false,
        }}
      />
    );

    expect(getByText(`${labelPrefix}.pending.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pending.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pending.badge`)).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.label-summary`)).not.toBeInTheDocument();
    expect(queryByText(mockPec)).not.toBeInTheDocument();
    expect(queryByRole('button', { name: `${labelPrefix}.verify-cta` })).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.disclaimer`)).not.toBeInTheDocument();
  });

  it('renders the PEC in readonly mode when the PEC is in activation and value is still available', () => {
    const props = createProps();

    const { getByText, queryByRole, queryByText } = render(
      <PecStep
        {...props}
        pec={{
          value: mockPec,
          alreadySet: false,
          isValid: false,
        }}
      />
    );

    expect(getByText(`${labelPrefix}.pending.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pending.description`)).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.pending.badge`)).not.toBeInTheDocument();

    expect(getByText(`${labelPrefix}.label-summary`)).toBeInTheDocument();
    expect(getByText(mockPec)).toBeInTheDocument();
    expect(queryByRole('button', { name: `${labelPrefix}.verify-cta` })).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.disclaimer`)).not.toBeInTheDocument();
  });

  it('renders the same PEC pending content even when the PEC value is not available after refresh', () => {
    const props = createProps();

    const { getByText, queryByText } = render(
      <PecStep
        {...props}
        pec={{
          value: undefined,
          alreadySet: false,
          isValid: false,
        }}
      />
    );

    expect(getByText(`${labelPrefix}.pending.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pending.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pending.badge`)).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.label-summary`)).not.toBeInTheDocument();
    expect(queryByText(mockPec)).not.toBeInTheDocument();
  });

  it('registers a continue handler that returns true when a PEC flow state already exists', async () => {
    const registerContinueHandler = vi.fn();

    render(
      <PecStep
        {...createProps()}
        pec={{
          value: undefined,
          alreadySet: false,
          isValid: false,
        }}
        registerContinueHandler={registerContinueHandler}
      />
    );

    expect(registerContinueHandler).toHaveBeenCalled();

    const continueHandler = registerContinueHandler.mock.calls.at(-1)[0];
    await expect(continueHandler()).resolves.toBe(true);
  });

  it('shows the field error when the PEC format is invalid', async () => {
    const props = createProps();

    const { getByLabelText, getByRole, findByText } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: 'abc' },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    expect(await findByText('legal-contacts.valid-pec')).toBeInTheDocument();
    expect(props.onPecChange).not.toHaveBeenCalled();
  });

  it('shows the field error when the PEC is empty', async () => {
    const props = createProps();

    const { getByRole, findByText } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    expect(await findByText('legal-contacts.valid-pec')).toBeInTheDocument();
    expect(props.onPecChange).not.toHaveBeenCalled();
  });

  it('returns false and shows the verification modal when continue is triggered with a formally valid PEC and accepted disclaimer', async () => {
    const registerContinueHandler = vi.fn();

    const { getByLabelText, getByRole, findByText } = render(
      <PecStep {...createProps()} registerContinueHandler={registerContinueHandler} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    const continueHandler = registerContinueHandler.mock.calls.at(-1)[0];

    let canContinue: boolean | undefined;
    await act(async () => {
      canContinue = await continueHandler();
    });

    expect(canContinue).toBe(false);
    expect(await findByText(`${labelPrefix}.verify-before-continue-title`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.verify-before-continue-content`)).toBeInTheDocument();
  });

  it('returns false and does not show the verification modal when continue is triggered with an invalid PEC', async () => {
    const registerContinueHandler = vi.fn();

    const { getByLabelText, findByText, queryByText } = render(
      <PecStep {...createProps()} registerContinueHandler={registerContinueHandler} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: 'abc' },
      });
    });

    const continueHandler = registerContinueHandler.mock.calls.at(-1)[0];

    let canContinue: boolean | undefined;
    await act(async () => {
      canContinue = await continueHandler();
    });

    expect(canContinue).toBe(false);
    expect(await findByText('legal-contacts.valid-pec')).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.verify-before-continue-title`)).not.toBeInTheDocument();
  });

  it('returns false and does not show the verification modal when continue is triggered without accepting the disclaimer', async () => {
    const registerContinueHandler = vi.fn();

    const { getByLabelText, findByText, queryByText } = render(
      <PecStep {...createProps()} registerContinueHandler={registerContinueHandler} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockPec },
      });
    });

    const continueHandler = registerContinueHandler.mock.calls.at(-1)[0];

    let canContinue: boolean | undefined;
    await act(async () => {
      canContinue = await continueHandler();
    });

    expect(canContinue).toBe(false);
    expect(await findByText('required-field')).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.verify-before-continue-title`)).not.toBeInTheDocument();
  });
});
