import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, DigitalAddress } from '../../../models/contacts';
import { internationalPhonePrefix } from '../../../utility/contacts.utility';
import SmsContactItem from '../SmsContactItem';
import { fillCodeDialog } from './test-utils';

const getConfigurationMock = vi.hoisted(() => vi.fn());

vi.mock('../../../services/configuration.service', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../services/configuration.service')>();
  return {
    ...original,
    getConfiguration: () => ({ ...original.getConfiguration(), ...getConfigurationMock() }),
  };
});

const phoneValue = '3333333333';

const smsAddress: DigitalAddress = {
  addressType: AddressType.COURTESY,
  recipientId: 'mock-recipient-id',
  senderId: 'default',
  channelType: ChannelType.SMS,
  value: internationalPhonePrefix + phoneValue,
};

const whatsappAddress: DigitalAddress = {
  ...smsAddress,
  channelType: ChannelType.WHATSAPP,
};

describe('SmsContactItem - scelta SMS / WhatsApp', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    getConfigurationMock.mockReturnValue({ IS_WHATSAPP_ENABLED: true });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('shows the channel selector when inserting a new number', () => {
    const { getByRole, getByTestId } = render(<SmsContactItem />);
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));

    const selector = getByTestId('mobileChannelSelector');
    expect(selector).toHaveTextContent('courtesy-contacts.mobile-channel-question');
    expect(within(selector).getByTestId('mobileChannel-SMS').querySelector('input')).toBeChecked();
    expect(
      within(selector).getByTestId('mobileChannel-WHATSAPP').querySelector('input')
    ).not.toBeChecked();
  });

  it('does not show the channel selector when WhatsApp is disabled', () => {
    getConfigurationMock.mockReturnValue({ IS_WHATSAPP_ENABLED: false });
    const { getByRole, queryByTestId, container } = render(<SmsContactItem />);
    expect(container).toHaveTextContent('courtesy-contacts.email-sms-updates');
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));
    expect(queryByTestId('mobileChannelSelector')).not.toBeInTheDocument();
  });

  it('adds a new number on WhatsApp', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/WHATSAPP', {
        value: internationalPhonePrefix + phoneValue,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/WHATSAPP', {
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<SmsContactItem />);
    fireEvent.click(result.getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));

    // scelta del canale WhatsApp
    const whatsappRadio = result.getByTestId('mobileChannel-WHATSAPP').querySelector('input');
    fireEvent.click(whatsappRadio!);
    await waitFor(() => expect(whatsappRadio).toBeChecked());

    const input = result.container.querySelector(`[name="default_sms"]`);
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => expect(input!).toHaveValue(phoneValue));
    fireEvent.click(result.getByTestId('default_sms-button'));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/addresses/COURTESY/default/WHATSAPP');
    });

    // il dialog OTP riporta i testi WhatsApp
    const dialog = await waitFor(() => result.getByTestId('codeDialog'));
    expect(dialog).toHaveTextContent('courtesy-contacts.whatsapp-verify');
    await fillCodeDialog(result);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      });
    });

    const courtesy = result.testStore
      .getState()
      .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY);
    expect(courtesy).toHaveLength(1);
    expect(courtesy[0].channelType).toBe(ChannelType.WHATSAPP);
    expect(courtesy[0].value).toBe(internationalPhonePrefix + phoneValue);
  });

  it('shows the WhatsApp card when the number is active on WhatsApp', () => {
    const { container, getByTestId } = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [whatsappAddress] } },
    });
    expect(container).toHaveTextContent('courtesy-contacts.whatsapp-title');
    expect(container).toHaveTextContent('courtesy-contacts.whatsapp-description');
    expect(getByTestId('switch-mobile-channel')).toHaveTextContent(
      'courtesy-contacts.mobile-channel-switch-to-sms'
    );
  });

  it('switches an active SMS number to WhatsApp and removes the SMS address', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/WHATSAPP', {
        value: internationalPhonePrefix + phoneValue,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/WHATSAPP', {
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [smsAddress] } },
    });
    expect(result.container).toHaveTextContent('courtesy-contacts.sms-title');

    fireEvent.click(result.getByTestId('switch-mobile-channel'));
    const confirmDialog = await waitFor(() => result.getByRole('dialog'));
    expect(confirmDialog).toHaveTextContent(
      'courtesy-contacts.mobile-channel-switch-title-whatsapp'
    );
    fireEvent.click(within(confirmDialog).getByRole('button', { name: 'button.conferma' }));

    await waitFor(() => expect(mock.history.post).toHaveLength(1));
    await fillCodeDialog(result);
    await waitFor(() => expect(mock.history.post).toHaveLength(2));

    await waitFor(() => {
      const courtesy = result.testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY);
      expect(courtesy).toHaveLength(1);
      expect(courtesy[0].channelType).toBe(ChannelType.WHATSAPP);
    });
  });

  it('disables the WhatsApp number', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/WHATSAPP').reply(204);

    const result = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [whatsappAddress] } },
    });
    fireEvent.click(result.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toHaveTextContent('courtesy-contacts.remove-whatsapp-message');
    const buttons = within(dialog).getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
      expect(mock.history.delete[0].url).toBe('/bff/v1/addresses/COURTESY/default/WHATSAPP');
    });
  });
});
