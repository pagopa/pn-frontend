import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ConsentType } from '@pagopa-pn/pn-commons';
import { getById, testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  acceptTosPrivacyConsentBodyMock,
  sercqSendTosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import {
  digitalCourtesyAddresses,
  digitalLegalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import {
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  AddressType,
  ChannelType,
  IOAllowedValues,
  SERCQ_SEND_VALUE,
} from '../../../models/contacts';
import { internationalPhonePrefix } from '../../../utility/contacts.utility';
import SercqSendContactItem from '../SercqSendContactItem';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('test SercqSendContactItem', () => {
  let mock: MockAdapter;
  const defaultAddress = digitalLegalAddressesSercq.find(
    (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SERCQ_SEND
  );

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component - disabled', () => {
    // render component
    const { container, getByTestId } = render(<SercqSendContactItem />);
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');
    const newsBadge = getByTestId('newsBadge');
    expect(newsBadge).toBeInTheDocument();
    const activateButton = getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    expect(activateButton).toHaveTextContent('legal-contacts.sercq-send-active');
    expect(activateButton).toBeEnabled();
  });

  it('enable service - courtesy contacts added', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v2/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);
    // render component
    const { container, getByTestId, queryByTestId, getByText } = render(<SercqSendContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const activateButton = getByTestId('activateButton');
    fireEvent.click(activateButton);
    let infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });
    // close info dialog
    const cancelButton = within(infoDialog).getByText('button.annulla');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // reopen info dialog
    fireEvent.click(activateButton);
    infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // wait rerendering due to redux changes
    // check new layout
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');
    const newsBadge = queryByTestId('newsBadge');
    expect(newsBadge).not.toBeInTheDocument();
    const newActivateButton = queryByTestId('activateButton');
    expect(newActivateButton).not.toBeInTheDocument();
    expect(container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('enable service - courtesy contacts not added - click on not now button', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(true, true));
    // render component
    const { container, getByTestId, getByText } = render(<SercqSendContactItem />);
    const activateButton = getByTestId('activateButton');
    fireEvent.click(activateButton);
    const infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // wait rerendering due to redux changes
    const courtesyDialog = await waitFor(() => screen.getByTestId('sercqSendCourtesyDialog'));
    expect(courtesyDialog).toBeInTheDocument();
    // click on not now button
    const notNowButton = within(courtesyDialog).getByText('button.not-now');
    fireEvent.click(notNowButton);
    await waitFor(() => expect(courtesyDialog).not.toBeInTheDocument());
    // check new layout
    expect(container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('enable service - courtesy contacts not added - add courtesy contact (no AppIO)', async () => {
    const phoneValue = '3333333333';
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(true, true));
    // render component
    const result = render(<SercqSendContactItem />);
    const activateButton = result.getByTestId('activateButton');
    fireEvent.click(activateButton);
    const infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // wait rerendering due to redux changes
    const courtesyDialog = await waitFor(() => screen.getByTestId('sercqSendCourtesyDialog'));
    expect(courtesyDialog).toBeInTheDocument();
    // select SMS
    await testRadio(
      courtesyDialog,
      'courtesyAddressRadio',
      ['courtesy-contacts.email-title', 'courtesy-contacts.sms-title'],
      1,
      true
    );
    const input = getById(courtesyDialog, 'value');
    fireEvent.change(input, { target: { value: phoneValue } });
    await waitFor(() => expect(input).toHaveValue(phoneValue));
    // click on confirm button
    const confirmButton = within(courtesyDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
      });
    });
    await waitFor(() => expect(courtesyDialog).not.toBeInTheDocument());
    // inser otp and confirm
    const codeDialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(3);
      expect(JSON.parse(mock.history.post[2].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      });
    });
    await waitFor(() => expect(codeDialog).not.toBeInTheDocument());
    // check new layout
    expect(result.container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = result.getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('enable service - courtesy contacts not added - add courtesy contact (AppIO)', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(true, true));
    // render component
    const result = render(<SercqSendContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.DISABLED,
            },
          ],
        },
      },
    });
    const activateButton = result.getByTestId('activateButton');
    fireEvent.click(activateButton);
    const infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // wait rerendering due to redux changes
    const courtesyDialog = await waitFor(() => screen.getByTestId('sercqSendCourtesyDialog'));
    expect(courtesyDialog).toBeInTheDocument();
    // select AppIO
    await testRadio(
      courtesyDialog,
      'courtesyAddressRadio',
      ['io-contact.title', 'courtesy-contacts.email-title', 'courtesy-contacts.sms-title'],
      0,
      true
    );
    // click on confirm button
    const confirmButton = within(courtesyDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: 'APPIO',
        verificationCode: '00000',
      });
    });
    await waitFor(() => expect(courtesyDialog).not.toBeInTheDocument());
    // check new layout
    expect(result.container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = result.getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/default/SERCQ_SEND').reply(204);
    // render component
    const { container, getByTestId } = render(<SercqSendContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const button = container.querySelector('button');
    // click on cancel
    fireEvent.click(button!);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons[0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // click on confirm
    fireEvent.click(button!);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog.querySelectorAll('button');
    fireEvent.click(dialogButtons[1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    await waitFor(() => {
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.channelType === ChannelType.SERCQ_SEND
          )
      ).toStrictEqual([]);
    });
    // wait rerendering due to redux changes
    await waitFor(() => {
      const activateButton = getByTestId('activateButton');
      expect(activateButton).toBeInTheDocument();
      expect(activateButton).toHaveTextContent('legal-contacts.sercq-send-active');
      expect(activateButton).toBeEnabled();
    });
  });
});
