import MockAdapter from 'axios-mock-adapter';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import {
  acceptTosSercqSendBodyMock,
  sercqSendTosConsentMock,
} from '../../../../__mocks__/Consents.mock';
import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import DigitalDomicileWizard from '../DigitalDomicileWizard';

describe('DigitalDomicileWizard', () => {
  const labelPrefix = 'onboarding.digital-domicile';

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('shows the SEND CTA when no PEC activation state exists', () => {
    const { getByText, getByRole, queryByText } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.choice.cta` })).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.choice.pec.cta` })).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.choice.pec-activating.title`)).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.choice.pec-activating.badge`)).not.toBeInTheDocument();
  });

  it('starts from the PEC step and shows the pending PEC content when a default PEC is in activation', () => {
    const { getByText, queryByRole } = render(<DigitalDomicileWizard />, {
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

    expect(getByText(`${labelPrefix}.pec.pending.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec.pending.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec.pending.badge`)).toBeInTheDocument();

    expect(
      queryByRole('button', { name: `${labelPrefix}.pec.verify-cta` })
    ).not.toBeInTheDocument();
  });

  it('starts from the PEC step and shows the readonly PEC summary when a default validated PEC is present', () => {
    const mockPec = 'test@pec.mock.pagopa.it';

    const { getByText, queryByRole, queryByText } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.LEGAL,
              senderId: 'default',
              channelType: ChannelType.PEC,
              value: mockPec,
              pecValid: true,
            },
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

    expect(getByText(`${labelPrefix}.pec.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec.label-summary`)).toBeInTheDocument();
    expect(getByText(mockPec)).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.pec.pending.title`)).not.toBeInTheDocument();
    expect(
      queryByRole('button', { name: `${labelPrefix}.pec.verify-cta` })
    ).not.toBeInTheDocument();
  });

  it('shows the PEC activating choice content when going back to step 1 with a PEC activation state', () => {
    const { getByText, getByRole, queryByRole } = render(<DigitalDomicileWizard />, {
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

    expect(getByText(`${labelPrefix}.choice.pec-activating.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.choice.pec-activating.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.choice.pec-activating.badge`)).toBeInTheDocument();

    expect(queryByRole('button', { name: `${labelPrefix}.choice.cta` })).not.toBeInTheDocument();
    expect(
      queryByRole('button', { name: `${labelPrefix}.choice.pec.cta` })
    ).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'button.continue' })).toBeInTheDocument();
  });

  it('does not show the next button in the SEND contact step when no email is available', () => {
    const { getByRole, queryByRole } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.cta` }));
    expect(queryByRole('button', { name: 'button.continue' })).not.toBeInTheDocument();
  });

  it('shows the PEC verification modal when the user tries to continue with a formally valid PEC and accepted disclaimer', async () => {
    const { getByRole, getByLabelText, findByText } = render(<DigitalDomicileWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.pec.cta` }));

    fireEvent.change(getByLabelText(`${labelPrefix}.pec.input-label`), {
      target: { value: 'test@pec.mock.pagopa.it' },
    });

    fireEvent.click(getByRole('checkbox'));
    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    expect(await findByText(`${labelPrefix}.pec.verify-before-continue-title`)).toBeInTheDocument();
    expect(
      await findByText(`${labelPrefix}.pec.verify-before-continue-content`)
    ).toBeInTheDocument();
  });

  it('does not show the PEC verification modal when the user tries to continue with an invalid PEC', async () => {
    const { getByRole, getByLabelText, findByText, queryByText } = render(
      <DigitalDomicileWizard />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [],
          },
        },
      }
    );

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.pec.cta` }));

    fireEvent.change(getByLabelText(`${labelPrefix}.pec.input-label`), {
      target: { value: 'abc' },
    });

    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    expect(await findByText('legal-contacts.valid-pec')).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.pec.verify-before-continue-title`)).not.toBeInTheDocument();
  });

  it('does not show the PEC verification modal when the user tries to continue without accepting the disclaimer', async () => {
    const { getByRole, getByLabelText, findByText, queryByText } = render(
      <DigitalDomicileWizard />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [],
          },
        },
      }
    );

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.pec.cta` }));

    fireEvent.change(getByLabelText(`${labelPrefix}.pec.input-label`), {
      target: { value: 'test@pec.mock.pagopa.it' },
    });

    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    expect(await findByText('required-field')).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.pec.verify-before-continue-title`)).not.toBeInTheDocument();
  });

  it('completes the SEND flow and shows the final feedback', async () => {
    const mockEmail = 'test@mock.pagopa.it';

    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosConsentMock(false));
    mock.onPut('/bff/v2/tos-privacy', acceptTosSercqSendBodyMock).reply(200);
    mock.onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND').reply(204);

    const { getByRole, getByText, findByText } = render(<DigitalDomicileWizard />, {
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
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.cta` }));
    });

    expect(getByText(`${labelPrefix}.email.title-existing`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.continue' }));
    });

    expect(await findByText(`${labelPrefix}.io.title`)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: `${labelPrefix}.buttons.continue-without-io`,
        })
      );
    });

    expect(await findByText(`${labelPrefix}.summary.title`)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: `${labelPrefix}.buttons.confirm-activation`,
        })
      );
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });

    expect(await findByText(`${labelPrefix}.feedback.send.title`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.feedback.send.content`)).toBeInTheDocument();
  });

  it('completes the PEC flow and shows the final feedback', async () => {
    const mockPec = 'test@pec.mock.pagopa.it';

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC')
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const { getByRole, getByLabelText, getByText, findByText, queryByText } = render(
      <DigitalDomicileWizard />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [],
          },
        },
      }
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.choice.pec.cta` }));
    });

    expect(getByText(`${labelPrefix}.pec.title`)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.pec.input-label`), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.pec.verify-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mockPec,
      });
    });

    expect(await findByText(`${labelPrefix}.pec.pending.title`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.pec.pending.description`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.pec.pending.badge`)).toBeInTheDocument();
    expect(queryByText(mockPec)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.continue' }));
    });

    expect(await findByText(`${labelPrefix}.io.title`)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: `${labelPrefix}.buttons.continue-without-io`,
        })
      );
    });

    expect(await findByText(`${labelPrefix}.summary.title`)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: `${labelPrefix}.buttons.confirm-activation`,
        })
      );
    });

    expect(await findByText(`${labelPrefix}.feedback.pec.title`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.feedback.pec.content`)).toBeInTheDocument();
  });
});
