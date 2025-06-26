import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { render, waitFor, within } from '../../../__test__/test-utils';
import { AddressType, ChannelType } from '../../../models/contacts';
import HowItWorksContactWizard from '../HowItWorksContactWizard';

describe('HowItWorksContactWizard', () => {
  const goToNextStep = vi.fn();
  const setShowPecWizard = vi.fn();

  it('render components', () => {
    const { getByText, getByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );

    expect(getByText('legal-contacts.sercq-send-wizard.step_1.title')).toBeInTheDocument();
    expect(getByTestId('sercq-send-info-list')).toBeInTheDocument();
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveTextContent('button.continue');
    expect(continueButton).toBeEnabled();
    const pecSection = getByTestId('pec-section');
    expect(pecSection).toBeInTheDocument();
  });

  it('should not show pec section if default pec address is present', () => {
    const { getByTestId, queryByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [
              {
                addressType: AddressType.LEGAL,
                senderId: 'default',
                channelType: ChannelType.PEC,
                value: 'pec@test.it',
                pecValid: true,
                codeValid: true,
              },
            ],
          },
        },
      }
    );

    const pecSection = queryByTestId('pec-section');
    expect(pecSection).not.toBeInTheDocument();
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeInTheDocument();
    const alertMessage = getByTestId('default-pec-info');
    expect(alertMessage).toBeInTheDocument();
  });

  it('should go to next step', async () => {
    const user = userEvent.setup();

    const { getByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );
    const continueButton = getByTestId('continueButton');
    await user.click(continueButton);

    expect(goToNextStep).toHaveBeenCalledTimes(1);
  });

  it('should open delivered dialog', async () => {
    const deliveredDialogPrefixLbl = 'legal-contacts.sercq-send-wizard.step_1.delivered-dialog';
    const user = userEvent.setup();

    const { getByTestId, queryByRole, findByRole } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );

    // Check the dialog is not present initially
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    const deliveredLink = getByTestId('deliveredLink');
    await user.click(deliveredLink);

    const deliveredDialog = await findByRole('dialog');
    expect(deliveredDialog).toBeInTheDocument();

    expect(
      within(deliveredDialog).getByText(`${deliveredDialogPrefixLbl}-title`)
    ).toBeInTheDocument();
    expect(
      within(deliveredDialog).getByText(`${deliveredDialogPrefixLbl}-description`)
    ).toBeInTheDocument();

    const confirmButton = within(deliveredDialog).getByRole('button', {
      name: 'button.understand',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
