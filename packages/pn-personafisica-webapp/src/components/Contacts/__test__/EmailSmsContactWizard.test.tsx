import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import EmailSmsContactWizard from '../EmailSmsContactWizard';

const labelPrefix = 'legal-contacts.sercq-send-wizard.step_3';

describe('EmailSmsContactWizard', () => {
  it('render component', () => {
    const { container, getByText, getByRole } = render(<EmailSmsContactWizard />);

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.content`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.email-disclaimer`)).toBeInTheDocument();

    // Email
    const emailInput = getById(container, 'default_email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('');

    const emailLabel = container.querySelector('#default_email-custom-label');
    expect(emailLabel).not.toBeInTheDocument();

    const emailButton = getByRole('button', { name: 'courtesy-contacts.email-add' });
    expect(emailButton).toBeInTheDocument();

    // sms section
    const smsUpdates = getByText('courtesy-contacts.email-sms-updates');
    expect(smsUpdates).toBeInTheDocument();
    const showSmsInputButton = getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    expect(showSmsInputButton).toBeInTheDocument();
  });

  it('shows SMS input, label and disclaimer on expand', () => {
    const { container, getByRole, getByText } = render(<EmailSmsContactWizard />);

    const expandBtn = getByRole('button', {
      name: 'courtesy-contacts.email-sms-add',
    });
    fireEvent.click(expandBtn);

    expect(getByText('courtesy-contacts.sms-to-add')).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.sms-disclaimer`)).toBeInTheDocument();

    const smsInput = getById(container, 'default_sms');
    expect(smsInput).toBeInTheDocument();
    expect(smsInput).toHaveValue('');

    const smsLabel = container.querySelector('#default_sms-custom-label');
    expect(smsLabel).not.toBeInTheDocument();

    // SMS Add button
    const smsAddButtonName = 'courtesy-contacts.sms-add';
    const smsAddButton = getByRole('button', { name: smsAddButtonName });
    expect(smsAddButton).toBeInTheDocument();

    // Cancel button
    const cancelButtonName = 'button.annulla';
    const cancelButton = getByRole('button', { name: cancelButtonName });
    expect(cancelButton).toBeInTheDocument();
  });

  it('collapses SMS section on cancel', () => {
    const { getByRole, getByText, queryByRole, queryByTestId } = render(<EmailSmsContactWizard />);

    // Click "Add SMS" button
    const addSmsButtonName = 'courtesy-contacts.email-sms-add';
    const addSmsButton = getByRole('button', { name: addSmsButtonName });
    fireEvent.click(addSmsButton);

    // Click "Cancel" button
    const cancelButtonName = 'button.annulla';
    const cancelButton = getByRole('button', { name: cancelButtonName });
    fireEvent.click(cancelButton);

    expect(queryByTestId('default_sms')).not.toBeInTheDocument();

    // Assert "Add SMS" button is not present
    const smsAddButtonName = 'courtesy-contacts.sms-add';
    const smsAddButton = queryByRole('button', { name: smsAddButtonName });
    expect(smsAddButton).not.toBeInTheDocument();

    // Assert "Cancel" button is not present
    expect(cancelButton).not.toBeInTheDocument();

    expect(getByText('courtesy-contacts.email-sms-updates')).toBeInTheDocument();

    const smsInsertButtonName = 'courtesy-contacts.email-sms-add';
    const smsInsertButton = getByRole('button', { name: smsInsertButtonName });
    expect(smsInsertButton).toBeInTheDocument();
  });

  it('shows label and hides disclaimer when email has a value', () => {
    const emailValue = 'test@mail.it';

    const { container, queryByText } = render(<EmailSmsContactWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: 'COURTESY',
              channelType: 'EMAIL',
              senderId: 'default',
              value: emailValue,
            },
          ],
        },
      },
    });

    const label = container.querySelector('#default_email-custom-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('courtesy-contacts.email-to-add');

    const emailReadOnlyField = getById(container, 'default_email-typography');
    expect(emailReadOnlyField).toBeInTheDocument();
    expect(emailReadOnlyField).toHaveTextContent(emailValue);

    expect(queryByText(`${labelPrefix}.email-disclaimer`)).not.toBeInTheDocument();
  });

  it('renders SMS in read-only mode when value exists', () => {
    const smsValue = '3331234567';

    const { container, queryByRole, queryByText } = render(<EmailSmsContactWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: 'COURTESY',
              channelType: 'SMS',
              senderId: 'default',
              value: smsValue,
            },
          ],
        },
      },
    });

    const label = container.querySelector('#default_sms-custom-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('courtesy-contacts.sms-to-add');

    const smsReadOnlyField = getById(container, 'default_sms-typography');
    expect(smsReadOnlyField).toBeInTheDocument();
    expect(smsReadOnlyField).toHaveTextContent(smsValue);

    expect(queryByText(`${labelPrefix}.sms-disclaimer`)).not.toBeInTheDocument();

    const smsInsertButtonName = 'courtesy-contacts.email-sms-add';
    const smsInsertButton = queryByRole('button', { name: smsInsertButtonName });
    expect(smsInsertButton).not.toBeInTheDocument();
  });
});
