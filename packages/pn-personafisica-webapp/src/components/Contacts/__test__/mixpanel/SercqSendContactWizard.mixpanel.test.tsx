import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  acceptTosSercqSendBodyMock,
  sercqSendTosConsentMock,
} from '../../../../__mocks__/Consents.mock';
import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import SercqSendContactWizard from '../../SercqSendContactWizard';

const courtesyEmailOnly = [
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@mail.it',
  },
];

const courtesySmsOnly = [
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.SMS,
    value: '+393333333333',
  },
];

const courtesyEmailAndSms = [
  ...courtesyEmailOnly,
  ...courtesySmsOnly,
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.IOMSG,
    value: IOAllowedValues.DISABLED,
  },
];

describe('SercqSendContactWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;
  const goToStep = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_SERCQ_SEND_SUMMARY on mount', () => {
    render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } },
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_SUMMARY_TOS_ACCEPTED when disclaimer is checked', () => {
    const { container } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } },
    });
    fireEvent.click(getById(container, 'disclaimer'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_ACCEPTED
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_SUMMARY_TOS_DISMISSED when disclaimer is unchecked', () => {
    const { container } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } },
    });
    const checkbox = getById(container, 'disclaimer');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_DISMISSED
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_TOS_MANDATORY and SEND_ADD_SERCQ_SEND_UX_CONVERSION when activate is clicked without disclaimer', async () => {
    const { getByTestId, findByTestId } = render(
      <SercqSendContactWizard goToStep={goToStep} />,
      { preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } } }
    );
    // wait for validateOnMount async Yup validation to settle before clicking
    await findByTestId('activateButton');
    fireEvent.click(getByTestId('activateButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION,
      expect.objectContaining({ tos_validation: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_UX_SUCCESS after successful activation', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', { value: SERCQ_SEND_VALUE })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosConsentMock(false));
    mock.onPut('/bff/v2/tos-privacy', acceptTosSercqSendBodyMock).reply(200);

    const { container, getByTestId } = render(
      <SercqSendContactWizard goToStep={goToStep} />,
      { preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } } }
    );

    fireEvent.click(getById(container, 'disclaimer'));
    fireEvent.click(getByTestId('activateButton'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS,
        expect.objectContaining({ event_type: expect.any(String), other_contact: expect.anything() })
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_GO_TO_SMS when the SMS link is clicked', () => {
    const { getByTestId } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: { contactsState: { digitalAddresses: courtesyEmailOnly } },
    });
    fireEvent.click(getByTestId('backToContactStep'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_SMS);
  });

  it('fires SEND_ADD_SERCQ_SEND_GO_TO_EMAIL when the email link is clicked', () => {
    const { getByTestId } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: { contactsState: { digitalAddresses: courtesySmsOnly } },
    });
    fireEvent.click(getByTestId('backToContactStep'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_EMAIL);
  });

  it('fires SEND_ADD_SERCQ_SEND_GO_TO_APP_IO when the IO link is clicked', () => {
    const { getByTestId } = render(
      <SercqSendContactWizard goToStep={goToStep} showIOStep />,
      { preloadedState: { contactsState: { digitalAddresses: courtesyEmailAndSms } } }
    );
    fireEvent.click(getByTestId('backToContactStep'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_APP_IO
    );
  });
});
