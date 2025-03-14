import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import EmailSmsContactWizard from '../EmailSmsContactWizard';

describe('EmailSmsContactWizard', () => {
  it('render component', () => {
    const { container, getByRole, getByText } = render(<EmailSmsContactWizard />);

    const title = getByText('legal-contacts.sercq-send-wizard.step_3.title');
    expect(title).toBeInTheDocument();
    const content = getByText('legal-contacts.sercq-send-wizard.step_3.content');
    expect(content).toBeInTheDocument();

    // Email
    const emailLabel = getById(container, 'default_email-label');
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toHaveTextContent('courtesy-contacts.email-to-add');

    const emailInput = getById(container, 'default_email');
    expect(emailInput).toHaveValue('');

    const emailButton = getByRole('button', { name: 'courtesy-contacts.email-add' });
    expect(emailButton).toBeInTheDocument();

    let smsUpdates = getByText('courtesy-contacts.email-sms-updates');
    expect(smsUpdates).toBeInTheDocument();
    let showSmsInputButton = getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    expect(showSmsInputButton).toBeInTheDocument();

    fireEvent.click(showSmsInputButton);
    expect(smsUpdates).not.toBeInTheDocument();
    expect(showSmsInputButton).not.toBeInTheDocument();

    // SMS
    const smsLabel = getById(container, 'default_sms-label');
    expect(smsLabel).toBeInTheDocument();
    expect(smsLabel).toHaveTextContent('courtesy-contacts.sms-to-add');

    const smsInput = getById(container, 'default_sms');
    expect(smsInput).toHaveValue('');

    const smsButton = getByRole('button', { name: 'courtesy-contacts.sms-add' });
    expect(smsButton).toBeInTheDocument();

    const smsCancelButton = getByRole('button', { name: 'button.annulla' });
    expect(smsCancelButton).toBeInTheDocument();

    fireEvent.click(smsCancelButton);

    expect(smsLabel).not.toBeInTheDocument();
    expect(smsInput).not.toBeInTheDocument();
    expect(smsButton).not.toBeInTheDocument();
    expect(smsCancelButton).not.toBeInTheDocument();

    smsUpdates = getByText('courtesy-contacts.email-sms-updates');
    expect(smsUpdates).toBeInTheDocument();
    showSmsInputButton = getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    expect(showSmsInputButton).toBeInTheDocument();
  });
});
