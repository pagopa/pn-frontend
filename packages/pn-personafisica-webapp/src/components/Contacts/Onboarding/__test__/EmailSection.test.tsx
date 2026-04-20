import { createRef } from 'react';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import EmailSection from '../EmailSection';

describe('EmailSection', () => {
  const labelPrefix = 'onboarding.digital-domicile';
  const mockEmail = 'test@mock.pagopa.it';
  const mockEmailChanged = 'changed@mock.pagopa.it';

  const createProps = () => ({
    emailValue: '',
    emailError: undefined,
    emailTouched: false,
    onEmailValueChange: vi.fn(),
    onEmailBlur: vi.fn(),
    onVerifyEmail: vi.fn(),
    onSubmitEmailEdit: vi.fn(),
    onExpand: vi.fn(),
    onCollapse: vi.fn(),
    emailContactRef: createRef<{
      toggleEdit: () => void;
      resetForm: () => Promise<void>;
    }>(),
  });

  it('renders the collapsed state and triggers onExpand', () => {
    const props = createProps();

    const { getByText, getByRole } = render(
      <EmailSection {...props} mode="collapsed" email={{ value: undefined, alreadySet: false }} />
    );

    expect(getByText(`${labelPrefix}.pec.optional-email-description`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.pec.email-cta` })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.pec.email-cta` }));
    expect(props.onExpand).toHaveBeenCalledTimes(1);
  });

  it('renders the insert state and triggers verify/collapse callbacks', () => {
    const props = createProps();

    const { getByText, getByLabelText, getByRole } = render(
      <EmailSection
        {...props}
        mode="insert"
        email={{ value: undefined, alreadySet: false }}
        emailValue={mockEmail}
        emailError="mock-error"
        emailTouched
      />
    );

    expect(getByText(`${labelPrefix}.pec.optional-email-title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec.optional-email-label`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.email.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.email.verify-cta` })).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.pec.cancel-email-cta` })
    ).toBeInTheDocument();
    expect(getByText('mock-error')).toBeInTheDocument();

    fireEvent.change(getByLabelText(`${labelPrefix}.email.input-label`), {
      target: { value: mockEmailChanged },
    });
    expect(props.onEmailValueChange).toHaveBeenCalledWith(mockEmailChanged);

    fireEvent.blur(getByLabelText(`${labelPrefix}.email.input-label`));
    expect(props.onEmailBlur).toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.email.verify-cta` }));
    expect(props.onVerifyEmail).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.pec.cancel-email-cta` }));
    expect(props.onCollapse).toHaveBeenCalledTimes(1);
  });

  it('renders the readonly state for an email added during the wizard', () => {
    const props = createProps();

    const { getByText, queryByRole } = render(
      <EmailSection {...props} mode="readonly" email={{ value: mockEmail, alreadySet: false }} />
    );

    expect(getByText(`${labelPrefix}.pec.email-present-description`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(queryByRole('button', { name: 'button.modifica' })).not.toBeInTheDocument();
  });

  it('renders the edit state through DigitalContact and forwards submit', async () => {
    const props = createProps();

    const { getByText, getByRole, getByLabelText } = render(
      <EmailSection {...props} mode="edit" email={{ value: mockEmail, alreadySet: true }} />
    );

    expect(getByText(`${labelPrefix}.pec.email-present-description`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.modifica' })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'button.modifica' }));

    expect(getByLabelText(`${labelPrefix}.email.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.conferma' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.annulla' })).toBeInTheDocument();

    fireEvent.change(getByLabelText(`${labelPrefix}.email.input-label`), {
      target: { value: mockEmailChanged },
    });

    fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    await waitFor(() => {
      expect(props.onSubmitEmailEdit).toHaveBeenCalledWith(mockEmailChanged);
    });
  });
});
