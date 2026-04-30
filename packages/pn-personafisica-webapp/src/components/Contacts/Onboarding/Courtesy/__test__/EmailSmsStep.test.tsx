import { vi } from 'vitest';

import { render } from '../../../../../__test__/test-utils';
import EmailSmsStep from '../EmailSmsStep';

describe('EmailSmsStep', () => {
  const labelPrefix = 'onboarding.courtesy';

  const createProps = () => ({
    ioEnabled: false,
    email: { value: undefined, alreadySet: false },
    sms: { value: undefined, alreadySet: false },
    onContactAdded: vi.fn(),
    registerContinueHandler: vi.fn(),
  });

  it('renders the email section in insert mode and the courtesy banner when IO is not enabled', () => {
    const { getByTestId, getByText, getByLabelText } = render(<EmailSmsStep {...createProps()} />);

    expect(getByTestId('email-sms-step')).toBeInTheDocument();
    expect(getByTestId('courtesy-banner')).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.email.insert.title`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.email.insert.input-label`)).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.sms.insert.title`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.sms.insert.input-label`)).toBeInTheDocument();
  });

  it('hides the courtesy banner and collapses the SMS section when IO is enabled', () => {
    const { getByText, getByRole, queryByTestId, queryByLabelText } = render(
      <EmailSmsStep {...createProps()} ioEnabled />
    );

    expect(queryByTestId('courtesy-banner')).not.toBeInTheDocument();

    expect(getByText(`${labelPrefix}.sms.collapsed.label`)).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.sms.collapsed.button-label` })
    ).toBeInTheDocument();
    expect(queryByLabelText(`${labelPrefix}.sms.insert.input-label`)).not.toBeInTheDocument();
  });

  it('renders the courtesy banner when IO is not enabled and the email is already set', () => {
    const { getByTestId } = render(
      <EmailSmsStep {...createProps()} email={{ value: 'test@mock.pagopa.it', alreadySet: true }} />
    );

    expect(getByTestId('courtesy-banner')).toBeInTheDocument();
  });

  it('renders the email edit section when the email is already set', () => {
    const mockEmail = 'test@mock.pagopa.it';

    const { getByText } = render(
      <EmailSmsStep {...createProps()} email={{ value: mockEmail, alreadySet: true }} />
    );

    expect(getByText(`${labelPrefix}.email.edit.title`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
  });
});
