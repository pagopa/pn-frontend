import { vi } from 'vitest';

import { A11yMessageAnnouncer } from '@pagopa-pn/pn-commons';

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

    it('announces invalid email on each verify attempt, but not while typing', async () => {
      const { getByLabelText, getByRole, queryByRole } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...createProps()} />
        </>
      );

      const emailInput = getByLabelText(`${labelPrefix}.email.insert.input-label`);

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: 'invalid-email' },
        });
      });

      // Nessun annuncio durante la digitazione
      expect(queryByRole('status')).not.toBeInTheDocument();

      const verifyButton = getByRole('button', {
        name: `${labelPrefix}.email.insert.button-label`,
      });

      await act(async () => {
        fireEvent.click(verifyButton);
      });

      // Verifica il messaggio annunciato
      await waitFor(() => {
        expect(getByRole('status')).toHaveTextContent('courtesy-contacts.valid-email');
      });

      // Verifica gli attributi di accessibilità del campo
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');

      const describedBy = emailInput.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const helperText = document.getElementById(describedBy!);
      expect(helperText).toHaveTextContent('courtesy-contacts.valid-email');

      const firstAnnouncement = getByRole('status').textContent;

      // Un secondo tentativo deve produrre un nuovo annuncio
      await act(async () => {
        fireEvent.click(verifyButton);
      });

      await waitFor(() => {
        expect(getByRole('status').textContent).not.toBe(firstAnnouncement);
      });
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

    it('announces invalid SMS on each verify attempt, but not while typing', async () => {
      const { getByLabelText, getByRole, queryByRole } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...createProps()} />
        </>
      );

      const smsInput = getByLabelText(`${labelPrefix}.sms.insert.input-label`);

      await act(async () => {
        fireEvent.change(smsInput, {
          target: { value: 'abc' },
        });
      });

      // Nessun annuncio durante la digitazione
      expect(queryByRole('status')).not.toBeInTheDocument();

      const verifyButton = getByRole('button', {
        name: `${labelPrefix}.sms.insert.button-label`,
      });

      await act(async () => {
        fireEvent.click(verifyButton);
      });

      // Verifica il contenuto dell'annuncio
      await waitFor(() => {
        expect(getByRole('status')).toHaveTextContent('courtesy-contacts.valid-sms');
      });

      // Verifica gli attributi ARIA del campo
      expect(smsInput).toHaveAttribute('aria-invalid', 'true');

      const describedBy = smsInput.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const helperText = document.getElementById(describedBy!);
      expect(helperText).toHaveTextContent('courtesy-contacts.valid-sms');

      const firstAnnouncement = getByRole('status').textContent;

      // Un secondo tentativo deve aggiornare l'annuncio
      await act(async () => {
        fireEvent.click(verifyButton);
      });

      await waitFor(() => {
        expect(getByRole('status').textContent).not.toBe(firstAnnouncement);
      });
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

      const { getByLabelText, getByText, queryByRole } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...props} />
        </>
      );

      await act(async () => {
        fireEvent.change(getByLabelText(`${labelPrefix}.email.insert.input-label`), {
          target: { value: 'test@mock.pagopa.it' },
        });
      });

      // Nessun annuncio durante la digitazione
      expect(queryByRole('status')).not.toBeInTheDocument();

      const continueHandler = getHandler();

      if (continueHandler === undefined) {
        throw new Error('Continue handler was not registered');
      }

      await act(async () => {
        await continueHandler();
      });

      // La modale email si apre perché l'email è valida ma non verificata
      await waitFor(() => {
        expect(getByText(`${labelPrefix}.email.verify-before-continue-title`)).toBeInTheDocument();
      });
    });

    it('closes when the confirm button is clicked', async () => {
      const { props, getHandler } = createPropsWithHandler();

      const { getByLabelText, getByRole, queryByText } = render(<EmailSmsStep {...props} />);

      await act(async () => {
        fireEvent.change(getByLabelText(`${labelPrefix}.email.insert.input-label`), {
          target: { value: 'test@mock.pagopa.it' },
        });
      });

      await act(async () => {
        await getHandler()?.();
      });

      await waitFor(() => {
        expect(getByRole('button', { name: 'button.understand' })).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'button.understand' }));
      });

      await waitFor(() => {
        expect(
          queryByText(`${labelPrefix}.email.verify-before-continue-title`)
        ).not.toBeInTheDocument();
      });
    });

    it('opens with the SMS title when an unverified SMS is detected on continue', async () => {
      const { props, getHandler } = createPropsWithHandler();

      const { getByLabelText, getByText, queryByRole } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...props} email={{ value: 'test@mock.pagopa.it', alreadySet: true }} />
        </>
      );

      await act(async () => {
        fireEvent.change(getByLabelText(`${labelPrefix}.sms.insert.input-label`), {
          target: { value: '3331234567' },
        });
      });

      // Nessun annuncio durante la digitazione
      expect(queryByRole('status')).not.toBeInTheDocument();

      const continueHandler = getHandler();

      if (continueHandler === undefined) {
        throw new Error('Continue handler was not registered');
      }

      await act(async () => {
        await continueHandler();
      });

      await waitFor(() => {
        expect(getByText(`${labelPrefix}.sms.verify-before-continue-title`)).toBeInTheDocument();
      });

      // Nessun errore da annunciare: il numero è formalmente valido
      expect(queryByRole('status')).not.toBeInTheDocument();
    });

    it('prioritizes email verification over SMS validation errors on continue', async () => {
      const { props, getHandler } = createPropsWithHandler();

      const { getByLabelText, getByText, queryByRole } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...props} />
        </>
      );

      await act(async () => {
        fireEvent.change(getByLabelText(`${labelPrefix}.email.insert.input-label`), {
          target: { value: 'test@mock.pagopa.it' },
        });

        fireEvent.change(getByLabelText(`${labelPrefix}.sms.insert.input-label`), {
          target: { value: 'abc' },
        });
      });

      const continueHandler = getHandler();

      if (!continueHandler) {
        throw new Error('Continue handler was not registered');
      }

      let canContinue: boolean | undefined;

      await act(async () => {
        canContinue = await continueHandler();
      });

      expect(canContinue).toBe(false);

      await waitFor(() => {
        expect(getByText(`${labelPrefix}.email.verify-before-continue-title`)).toBeInTheDocument();
      });

      expect(queryByRole('status')).not.toBeInTheDocument();
    });

    it('announces SMS validation error on continue when no verification modal is needed', async () => {
      const { props, getHandler } = createPropsWithHandler();

      const { getByLabelText, getByRole, queryByText } = render(
        <>
          <A11yMessageAnnouncer />
          <EmailSmsStep {...props} email={{ value: 'test@mock.pagopa.it', alreadySet: true }} />
        </>
      );

      await act(async () => {
        fireEvent.change(getByLabelText(`${labelPrefix}.sms.insert.input-label`), {
          target: { value: 'abc' },
        });
      });

      const continueHandler = getHandler();

      if (!continueHandler) {
        throw new Error('Continue handler was not registered');
      }

      let canContinue: boolean | undefined;

      await act(async () => {
        canContinue = await continueHandler();
      });

      expect(canContinue).toBe(false);

      await waitFor(() => {
        expect(getByRole('status')).toHaveTextContent('courtesy-contacts.valid-sms');
      });

      expect(
        queryByText(`${labelPrefix}.email.verify-before-continue-title`)
      ).not.toBeInTheDocument();

      expect(
        queryByText(`${labelPrefix}.sms.verify-before-continue-title`)
      ).not.toBeInTheDocument();
    });
  });
});
