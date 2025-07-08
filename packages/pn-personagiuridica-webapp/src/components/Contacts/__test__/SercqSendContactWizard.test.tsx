import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ConsentType, SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import {
  acceptTosPrivacyConsentBodyMock,
  sercqSendTosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SercqSendContactWizard from '../SercqSendContactWizard';

describe('SercqSendContactWizard', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const goToStep = vi.fn();

  it('render components', async () => {
    const { getByText, getByTestId } = render(<SercqSendContactWizard goToStep={goToStep} />);

    expect(getByText('legal-contacts.sercq-send-wizard.step_1.title')).toBeInTheDocument();
    expect(getByTestId('sercq-send-info-list')).toBeInTheDocument();
    const activateButton = getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    expect(activateButton).toHaveTextContent('button.enable');
    expect(activateButton).toBeEnabled();
    const pecSection = getByTestId('pec-section');
    expect(pecSection).toBeInTheDocument();
  });

  it('should not show pec section if default pec address is present', async () => {
    const { getByTestId, queryByTestId } = render(<SercqSendContactWizard goToStep={goToStep} />, {
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
    });

    const pecSection = queryByTestId('pec-section');
    expect(pecSection).not.toBeInTheDocument();
    const activateButton = getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    const alertMessage = getByTestId('default-pec-info');
    expect(alertMessage).toBeInTheDocument();
  });

  it('should activate sercq send', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onGet(/\/bff\/v1\/pg\/tos-privacy.*/)
      .reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v1/pg/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);
    // render component
    const { getByTestId } = render(<SercqSendContactWizard goToStep={goToStep} />);
    const activateButton = getByTestId('activateButton');
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
