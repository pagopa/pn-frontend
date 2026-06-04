import { createRef } from 'react';
import { vi } from 'vitest';

import { PFTriggerEventSpy, act, fireEvent, render } from '../../../../../../__test__/test-utils';
import { OnboardingAvailableFlows } from '../../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../../models/PFEventsType';
import { ChannelType } from '../../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import CourtesyContactHandler from '../../CourtesyContactHandler';

describe('CourtesyContactHandler - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  const mockEmail = 'test@mock.pagopa.it';
  const mockPhone = '+393331234567';
  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.COURTESY };

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  const createProps = (channelType: ChannelType.EMAIL | ChannelType.SMS = ChannelType.EMAIL) => ({
    channelType,
    mode: 'edit' as const,
    contactValue: '',
    contactState: {
      value: channelType === ChannelType.EMAIL ? mockEmail : mockPhone,
      alreadySet: true,
    },
    onContactValueChange: vi.fn(),
    onInputBlur: vi.fn(),
    onVerifyContact: vi.fn(),
    onSubmitEdit: vi.fn(),
    onExpand: vi.fn(),
    onCollapse: vi.fn(),
    contactRef: createRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>(),
  });

  it('fires SEND_ONBOARDING_EMAIL_EDITING when the edit button is clicked for email', async () => {
    const { getByRole } = render(<CourtesyContactHandler {...createProps(ChannelType.EMAIL)} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_SMS_EDITING when the edit button is clicked for SMS', async () => {
    const { getByRole } = render(<CourtesyContactHandler {...createProps(ChannelType.SMS)} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_EDITING,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_CONFIRMED when edit is confirmed for email', async () => {
    const { getByRole } = render(<CourtesyContactHandler {...createProps(ChannelType.EMAIL)} />);

    // Enter edit mode first
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    // Confirm (same value → no API call)
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_SMS_CONFIRMED when edit is confirmed for SMS', async () => {
    const { getByRole } = render(<CourtesyContactHandler {...createProps(ChannelType.SMS)} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_CONFIRMED,
      basePayload
    );
  });
});
