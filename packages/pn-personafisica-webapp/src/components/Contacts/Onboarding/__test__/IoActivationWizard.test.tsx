import MockAdapter from 'axios-mock-adapter';

import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import IoActivationWizard from '../IoActivationWizard';

describe('IoActivationWizard', () => {
  const labelPrefix = 'onboarding.io-activation';
  const ioStepPrefix = 'onboarding.digital-domicile.io';

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

  it('renders the IO activation wizard without stepper and global wizard actions', () => {
    const { getByText, getByTestId, queryByTestId, queryByRole } = render(<IoActivationWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${ioStepPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${ioStepPrefix}.description`)).toBeInTheDocument();

    expect(getByTestId('exit-button')).toBeInTheDocument();
    expect(queryByTestId('desktopWizardStepper')).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'button.continue' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'button.indietro' })).not.toBeInTheDocument();
  });

  it('activates IO and shows the final feedback automatically', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(200, {
      result: 'OK',
    });

    const { getByRole, findByText } = render(<IoActivationWizard />, {
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

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${ioStepPrefix}.disabled.primary-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'APPIO',
        verificationCode: '00000',
      });
    });

    expect(await findByText(`${labelPrefix}.feedback.title`)).toBeInTheDocument();
    expect(await findByText(`${labelPrefix}.feedback.content`)).toBeInTheDocument();
  });
});
