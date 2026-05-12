import { vi } from 'vitest';

import { act, fireEvent, render, waitFor } from '../../../../../__test__/test-utils';
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

  it('renders the container', () => {
    const { getByTestId } = render(<EmailSmsStep {...createProps()} />);
    expect(getByTestId('email-sms-step')).toBeInTheDocument();
  });

  describe('courtesy banner', () => {
    it('shows when IO is not enabled', () => {
      const { getByTestId } = render(<EmailSmsStep {...createProps()} />);
      expect(getByTestId('courtesy-banner')).toBeInTheDocument();
    });

    it('hides when IO is enabled', () => {
      const { queryByTestId } = render(<EmailSmsStep {...createProps()} ioEnabled />);
      expect(queryByTestId('courtesy-banner')).not.toBeInTheDocument();
    });

    it('shows when email is already set and IO is not enabled', () => {
      const { getByTestId } = render(
        <EmailSmsStep
          {...createProps()}
          email={{ value: 'test@mock.pagopa.it', alreadySet: true }}
        />
      );
      expect(getByTestId('courtesy-banner')).toBeInTheDocument();
    });
  });

  describe('email section', () => {
    it('renders in insert mode by default', () => {
      const { getByText, getByLabelText } = render(<EmailSmsStep {...createProps()} />);

      expect(getByText(`${labelPrefix}.email.insert.title`)).toBeInTheDocument();
      expect(getByLabelText(`${labelPrefix}.email.insert.input-label`)).toBeInTheDocument();
    });

    it('renders in readonly mode when the email was just added during the wizard', () => {
      const mockEmail = 'test@mock.pagopa.it';

      const { getByText } = render(
        <EmailSmsStep {...createProps()} email={{ value: mockEmail, alreadySet: false }} />
      );

      expect(getByText(`${labelPrefix}.email.readonly.title`)).toBeInTheDocument();
      expect(getByText(mockEmail)).toBeInTheDocument();
    });

    it('renders in edit mode when the email is already set', () => {
      const mockEmail = 'test@mock.pagopa.it';

      const { getByText } = render(
        <EmailSmsStep {...createProps()} email={{ value: mockEmail, alreadySet: true }} />
      );

      expect(getByText(`${labelPrefix}.email.edit.title`)).toBeInTheDocument();
      expect(getByText(mockEmail)).toBeInTheDocument();
    });
  });

  describe('sms section', () => {
    it('renders in insert mode when IO is not enabled', () => {
      const { getByText, getByLabelText } = render(<EmailSmsStep {...createProps()} />);

      expect(getByText(`${labelPrefix}.sms.insert.title`)).toBeInTheDocument();
      expect(getByLabelText(`${labelPrefix}.sms.insert.input-label`)).toBeInTheDocument();
    });

    it('renders in collapsed mode when IO is enabled', () => {
      const { getByText, getByRole, queryByLabelText } = render(
        <EmailSmsStep {...createProps()} ioEnabled />
      );

      expect(getByText(`${labelPrefix}.sms.collapsed.label`)).toBeInTheDocument();
      expect(
        getByRole('button', { name: `${labelPrefix}.sms.collapsed.button-label` })
      ).toBeInTheDocument();
      expect(queryByLabelText(`${labelPrefix}.sms.insert.input-label`)).not.toBeInTheDocument();
    });

    it('expands to insert mode when the expand CTA is clicked', () => {
      const { getByRole, getByLabelText, queryByLabelText } = render(
        <EmailSmsStep {...createProps()} ioEnabled />
      );

      expect(queryByLabelText(`${labelPrefix}.sms.insert.input-label`)).not.toBeInTheDocument();

      fireEvent.click(getByRole('button', { name: `${labelPrefix}.sms.collapsed.button-label` }));

      expect(getByLabelText(`${labelPrefix}.sms.insert.input-label`)).toBeInTheDocument();
    });

    it('collapses back when the collapse CTA is clicked', () => {
      const { getByRole, queryByLabelText } = render(<EmailSmsStep {...createProps()} ioEnabled />);

      fireEvent.click(getByRole('button', { name: `${labelPrefix}.sms.collapsed.button-label` }));
      expect(queryByLabelText(`${labelPrefix}.sms.insert.input-label`)).toBeInTheDocument();

      fireEvent.click(getByRole('button', { name: `${labelPrefix}.sms.insert.collapse-label` }));
      expect(queryByLabelText(`${labelPrefix}.sms.insert.input-label`)).not.toBeInTheDocument();
    });

    it('renders in readonly mode when SMS was just added during the wizard', () => {
      const mockPhone = '+393331234567';

      const { getByText } = render(
        <EmailSmsStep {...createProps()} sms={{ value: mockPhone, alreadySet: false }} />
      );

      expect(getByText(`${labelPrefix}.sms.readonly.title`)).toBeInTheDocument();
      expect(getByText(mockPhone)).toBeInTheDocument();
    });

    it('renders in edit mode when the SMS is already set', () => {
      const mockPhone = '+393331234567';

      const { getByText } = render(
        <EmailSmsStep {...createProps()} sms={{ value: mockPhone, alreadySet: true }} />
      );

      expect(getByText(`${labelPrefix}.sms.edit.title`)).toBeInTheDocument();
      expect(getByText(`${labelPrefix}.sms.edit.description`)).toBeInTheDocument();
    });
  });

  describe('verify modal', () => {
    const createPropsWithHandler = () => {
      let capturedHandler: (() => Promise<boolean>) | undefined;
      const registerContinueHandler = vi
        .fn()
        .mockImplementation((h: () => Promise<boolean>) => (capturedHandler = h));
      return {
        props: { ...createProps(), registerContinueHandler },
        getHandler: () => capturedHandler,
      };
    };

    it('opens with the email title when an unverified email is detected on continue', async () => {
      const { props, getHandler } = createPropsWithHandler();
      const { getByLabelText, getByText } = render(<EmailSmsStep {...props} />);

      fireEvent.change(getByLabelText(`${labelPrefix}.email.insert.input-label`), {
        target: { value: 'test@mock.pagopa.it' },
      });

      await act(async () => void getHandler()?.());

      await waitFor(() => {
        expect(getByText(`${labelPrefix}.email.verify-before-continue-title`)).toBeInTheDocument();
      });
    });

    it('closes when the confirm button is clicked', async () => {
      const { props, getHandler } = createPropsWithHandler();
      const { getByLabelText, getByRole, queryByText } = render(<EmailSmsStep {...props} />);

      fireEvent.change(getByLabelText(`${labelPrefix}.email.insert.input-label`), {
        target: { value: 'test@mock.pagopa.it' },
      });

      await act(async () => void getHandler()?.());

      await waitFor(() =>
        expect(getByRole('button', { name: 'button.understand' })).toBeInTheDocument()
      );

      fireEvent.click(getByRole('button', { name: 'button.understand' }));

      await waitFor(() => {
        expect(
          queryByText(`${labelPrefix}.email.verify-before-continue-title`)
        ).not.toBeInTheDocument();
      });
    });

    it('opens with the SMS title when an unverified SMS is detected on continue', async () => {
      const { props, getHandler } = createPropsWithHandler();

      const { getByLabelText, getByText } = render(
        <EmailSmsStep {...props} email={{ value: 'test@mock.pagopa.it', alreadySet: true }} />
      );

      fireEvent.change(getByLabelText(`${labelPrefix}.sms.insert.input-label`), {
        target: { value: '3331234567' },
      });

      await act(async () => void getHandler()?.());

      await waitFor(() => {
        expect(getByText(`${labelPrefix}.sms.verify-before-continue-title`)).toBeInTheDocument();
      });
    });
  });
});
