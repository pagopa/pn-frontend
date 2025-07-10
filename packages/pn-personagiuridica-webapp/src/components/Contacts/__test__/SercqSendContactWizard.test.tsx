import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  acceptTosSercqSendBodyMock,
  sercqSendTosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SercqSendContactWizard from '../SercqSendContactWizard';

const labelPrefix = 'legal-contacts.sercq-send-wizard.step_3';

describe('SercqSendContactWizard', () => {
  let mock: MockAdapter;
  let goToStep = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render components', async () => {
    const initialAddresses = digitalAddresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY
    );
    const { container, getByText, getByTestId } = render(
      <SercqSendContactWizard goToStep={goToStep} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: initialAddresses,
          },
        },
      }
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.content`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.digital-domicile`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.send`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.courtesy-content`)).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.contacts-list.email.title`)).toBeInTheDocument();
    expect(getByText(initialAddresses[0].value));

    expect(getByText(`${labelPrefix}.contacts-list.sms.title`)).toBeInTheDocument();
    expect(getByText(initialAddresses[1].value));

    const icons = container.querySelectorAll(
      'svg[data-testid="CheckCircleIcon"], svg[data-testid="ErrorIcon"]'
    );

    const emailIcon = icons[0];
    const smsIcon = icons[1];
    expect(emailIcon).toHaveAttribute('data-testid', 'CheckCircleIcon');
    expect(smsIcon).toHaveAttribute('data-testid', 'CheckCircleIcon');

    const disclaimerCkb = getById(container, 'disclaimer');
    expect(disclaimerCkb).not.toBeChecked();
    expect(getByText(`${labelPrefix}.disclaimer`)).toBeInTheDocument();

    const activateButton = getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    expect(activateButton).toHaveTextContent(`${labelPrefix}.enable`);
  });

  it('should show links to relative steps - no email', async () => {
    const initialAddresses = [
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.SMS,
        value: '+393333333333',
      },
    ];

    // render component
    const { container, getByText } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: initialAddresses,
        },
      },
    });

    expect(getByText(`${labelPrefix}.contacts-list.email.title`)).toBeInTheDocument();
    const emailLink = getByText(`${labelPrefix}.contacts-list.email.textDisabled`, {
      selector: 'a',
    });

    expect(getByText(`${labelPrefix}.contacts-list.sms.title`)).toBeInTheDocument();
    expect(getByText(initialAddresses[0].value));

    const icons = container.querySelectorAll(
      'svg[data-testid="CheckCircleIcon"], svg[data-testid="ErrorIcon"]'
    );
    expect(icons.length).toBe(2);
    const emailIcon = icons[0];
    const smsIcon = icons[1];
    expect(emailIcon).toHaveAttribute('data-testid', 'ErrorIcon');
    expect(smsIcon).toHaveAttribute('data-testid', 'CheckCircleIcon');

    fireEvent.click(emailLink);

    expect(goToStep).toHaveBeenCalledTimes(1);
    expect(goToStep).toHaveBeenCalledWith(1);
  });

  it('should show links to relative steps - no sms', async () => {
    const initialAddresses = [
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.EMAIL,
        value: 'nome.utente@mail.it',
      },
    ];

    // render component
    const { container, getByText } = render(<SercqSendContactWizard goToStep={goToStep} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: initialAddresses,
        },
      },
    });

    expect(getByText(`${labelPrefix}.contacts-list.email.title`)).toBeInTheDocument();
    expect(getByText(initialAddresses[0].value));

    expect(getByText(`${labelPrefix}.contacts-list.sms.title`)).toBeInTheDocument();
    const smsLink = getByText(`${labelPrefix}.contacts-list.sms.textDisabled`, {
      selector: 'a',
    });

    const icons = container.querySelectorAll(
      'svg[data-testid="CheckCircleIcon"], svg[data-testid="ErrorIcon"]'
    );
    expect(icons.length).toBe(2);
    const emailIcon = icons[0];
    const smsIcon = icons[1];
    expect(emailIcon).toHaveAttribute('data-testid', 'CheckCircleIcon');
    expect(smsIcon).toHaveAttribute('data-testid', 'ErrorIcon');

    fireEvent.click(smsLink);

    expect(goToStep).toHaveBeenCalledTimes(1);
    expect(goToStep).toHaveBeenCalledWith(1);
  });

  it('should activate sercq send', async () => {
    const initialAddresses = [
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.EMAIL,
        value: 'nome.utente@mail.it',
      },
    ];

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v1\/pg\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false));
    mock.onPut('/bff/v1/pg/tos-privacy', acceptTosSercqSendBodyMock).reply(200);

    // render component
    const { container, findByText, getByTestId, queryByText } = render(
      <SercqSendContactWizard goToStep={goToStep} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: initialAddresses,
          },
        },
      }
    );

    const icons = container.querySelectorAll(
      'svg[data-testid="CheckCircleIcon"], svg[data-testid="ErrorIcon"]'
    );
    expect(icons.length).toBe(2);
    const emailIcon = icons[0];
    const smsIcon = icons[1];
    expect(emailIcon).toHaveAttribute('data-testid', 'CheckCircleIcon');
    expect(smsIcon).toHaveAttribute('data-testid', 'ErrorIcon');

    const activateButton = getByTestId('activateButton');
    let errorMsg = queryByText('required-field');
    expect(errorMsg).not.toBeInTheDocument();

    fireEvent.click(activateButton);

    errorMsg = await findByText('required-field');
    expect(errorMsg).toBeInTheDocument();

    const disclaimerCkb = getById(container, 'disclaimer');
    expect(disclaimerCkb).not.toBeChecked();

    fireEvent.click(disclaimerCkb);

    expect(disclaimerCkb).toBeChecked();

    fireEvent.click(activateButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });

    expect(goToStep).toHaveBeenCalledTimes(1);
    expect(goToStep).toHaveBeenCalledWith(3);
  });
});
