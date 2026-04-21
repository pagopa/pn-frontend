import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { getConfiguration } from '../../../../services/configuration.service';
import { openAppIoDownloadPage } from '../../../../utility/appio.utility';
import IoStep from '../IoStep';

vi.mock('../../../../utility/appio.utility', () => ({
  openAppIoDownloadPage: vi.fn(),
}));

describe('IoStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.io';
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  const createProps = () => ({
    value: undefined as IOAllowedValues | undefined,
    onChange: vi.fn(),
    onContinue: vi.fn(),
  });

  it('renders the unavailable state with download and refresh CTAs', () => {
    const props = createProps();

    const { getByText, getByRole } = render(<IoStep {...props} />);

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.not-installed.primary-cta` })
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.not-installed.refresh-cta` })
    ).toBeInTheDocument();
  });

  it('opens the App IO download page when the primary CTA is clicked in unavailable state', async () => {
    const props = createProps();

    const {
      APP_IO_SITE: appIoSite,
      APP_IO_ANDROID: appIoAndroid,
      APP_IO_IOS: appIoIos,
    } = getConfiguration();

    const { getByRole } = render(<IoStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.not-installed.primary-cta` }));
    });

    expect(openAppIoDownloadPage).toHaveBeenCalledTimes(1);
    expect(openAppIoDownloadPage).toHaveBeenCalledWith({
      appIoSite,
      appIoAndroid,
      appIoIos,
    });
    expect(props.onChange).not.toHaveBeenCalled();
    expect(props.onContinue).not.toHaveBeenCalled();
  });

  it('refreshes the IO state and calls onChange with the value from addresses', async () => {
    const props = createProps();

    mock.onGet('/bff/v1/addresses').reply(200, [
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.IOMSG,
        value: IOAllowedValues.DISABLED,
      },
    ]);

    const { getByRole } = render(<IoStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.not-installed.refresh-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(props.onChange).toHaveBeenCalledWith(IOAllowedValues.DISABLED);
    });
  });

  it('renders the disabled state and enables IO on primary CTA click', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(200, {
      result: 'OK',
    });

    const { getByText, getByRole, queryByRole } = render(
      <IoStep {...props} value={IOAllowedValues.DISABLED} />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.disabled.primary-cta` })
    ).toBeInTheDocument();
    expect(
      queryByRole('button', { name: `${labelPrefix}.not-installed.refresh-cta` })
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.disabled.primary-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'APPIO',
        verificationCode: '00000',
      });
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(IOAllowedValues.ENABLED);
      expect(props.onContinue).not.toHaveBeenCalled();
    });
  });

  it('renders the enabled state and calls onContinue on primary CTA click', async () => {
    const props = createProps();

    const { getByText, getByRole } = render(<IoStep {...props} value={IOAllowedValues.ENABLED} />);

    expect(getByText(`${labelPrefix}.enabled.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.enabled.primary-cta` })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.enabled.primary-cta` }));
    });

    expect(props.onContinue).toHaveBeenCalledTimes(1);
    expect(props.onChange).not.toHaveBeenCalled();
  });
});
