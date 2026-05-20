import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { EventAction, SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import {
  acceptTosSercqSendBodyMock,
  sercqSendTosConsentMock,
} from '../../../../../__mocks__/Consents.mock';
import { act, fireEvent, render, waitFor } from '../../../../../__test__/test-utils';
import { apiClient } from '../../../../../api/apiClients';
import { OnboardingAvailableFlows, OnboardingScreen } from '../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../models/PFEventsType';
import { AddressType, ChannelType } from '../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import DigitalDomicileWizard from '../../DigitalDomicileWizard';

describe('DigitalDomicileWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  const emptyContactsState = { contactsState: { digitalAddresses: [] } };

  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ONBOARDING_SERCQ_ACTIVATION on mount (choice step screen view)', () => {
    render(<DigitalDomicileWizard />, { preloadedState: emptyContactsState });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_SERCQ_ACTIVATION, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_SERCQ_SEND_SELECTED when the SEND CTA is clicked', () => {
    const { getByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.choice.cta' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SERCQ_SEND_SELECTED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_ACTIVATION on entering the email step in SEND mode', () => {
    const mockEmail = 'test@mock.pagopa.it';

    const { getByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: mockEmail,
            },
          ],
        },
      },
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.choice.cta' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATION, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
      email_value: mockEmail,
    });
  });

  it('fires SEND_ONBOARDING_PEC_EMAIL_ACTIVATION on entering the PEC step', () => {
    const { getByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.choice.pec.cta' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_PEC_EMAIL_ACTIVATION,
      {
        ...basePayload,
        event_type: EventAction.SCREEN_VIEW,
        email_value: undefined,
      }
    );
  });

  it('fires SEND_ONBOARDING_CONTINUE_SELECTED when the next button is clicked on the PEC step', () => {
    const { getByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.LEGAL,
              senderId: 'default',
              channelType: ChannelType.PEC,
              pecValid: false,
            },
          ],
        },
      },
    });

    // Wizard starts at PEC step (step 1) because a PEC with pecValid:false is already present
    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_CONTINUE_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.PEC,
    });
  });

  it('fires SEND_ONBOARDING_BACK_SELECTED when the back button is clicked on the PEC step', () => {
    const { getByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.LEGAL,
              senderId: 'default',
              channelType: ChannelType.PEC,
              pecValid: false,
            },
          ],
        },
      },
    });

    fireEvent.click(getByRole('button', { name: 'button.indietro' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_BACK_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.PEC,
    });
  });

  it('fires SEND_ONBOARDING_EXIT_SELECTED when the exit button is clicked', () => {
    const { getByTestId } = render(<DigitalDomicileWizard />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByTestId('exit-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EXIT_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.CHOICE,
    });
  });

  it('fires SEND_ONBOARDING_IO_DOWNLOAD_DECLINED and SEND_ONBOARDING_FLOW_RECAP when skipping IO and reaching summary in SEND mode', async () => {
    const mockEmail = 'test@mock.pagopa.it';

    const { getByRole, findByText } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: mockEmail,
            },
          ],
        },
      },
    });

    // Enter SEND mode
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.choice.cta' }));
    });

    // Continue from email step
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.continue' }));
    });

    // Skip IO (continue without IO)
    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: 'onboarding.digital-domicile.buttons.continue-without-io',
        })
      );
    });

    await findByText('onboarding.digital-domicile.summary.title');

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_DECLINED,
      expect.objectContaining(basePayload)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_FLOW_RECAP, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_UX_CONVERSION and SEND_ONBOARDING_UX_SUCCESS on completing the SEND flow', async () => {
    const mockEmail = 'test@mock.pagopa.it';

    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosConsentMock(false));
    mock.onPut('/bff/v2/tos-privacy', acceptTosSercqSendBodyMock).reply(200);
    mock.onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND').reply(204, {
      value: SERCQ_SEND_VALUE,
    });

    const { getByRole, findByText } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: mockEmail,
            },
          ],
        },
      },
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.choice.cta' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.continue' }));
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.buttons.continue-without-io' })
      );
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    await findByText('onboarding.digital-domicile.feedback.send.title');

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_UX_CONVERSION,
      expect.objectContaining(basePayload)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_UX_SUCCESS, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });
});
