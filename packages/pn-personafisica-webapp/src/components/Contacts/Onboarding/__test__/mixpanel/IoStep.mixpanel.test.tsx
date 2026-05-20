import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { act, fireEvent, render, waitFor } from '../../../../../__test__/test-utils';
import { apiClient } from '../../../../../api/apiClients';
import { OnboardingAvailableFlows } from '../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../models/PFEventsType';
import { IOAllowedValues } from '../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { openAppIoDownloadPage } from '../../../../../utility/appio.utility';
import IoStep from '../../IoStep';

vi.mock('../../../../../utility/appio.utility', () => ({
  openAppIoDownloadPage: vi.fn(),
}));

describe('IoStep - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  const createProps = (value?: IOAllowedValues, flow = OnboardingAvailableFlows.DIGITAL_DOMICILE) => ({
    value,
    onChange: vi.fn(),
    onContinue: vi.fn(),
    selectedOnboardingFlow: flow,
  });

  it('fires SEND_ONBOARDING_IO_DOWNLOAD on mount when IO is not installed (value undefined)', () => {
    const props = createProps(undefined);
    render(<IoStep {...props} />);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });
  });

  it('fires SEND_ONBOARDING_IO_ACTIVATION on mount when IO is installed but disabled', () => {
    const props = createProps(IOAllowedValues.DISABLED);
    render(<IoStep {...props} />);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_ACTIVATION, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });
  });

  it('fires SEND_ONBOARDING_IO_VERIFICATION on mount when IO is already enabled', () => {
    const props = createProps(IOAllowedValues.ENABLED);
    render(<IoStep {...props} />);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_VERIFICATION, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });
  });

  it('fires SEND_ONBOARDING_IO_DOWNLOAD_SELECTED when the download CTA is clicked', async () => {
    const props = createProps(undefined);
    const { getByTestId } = render(<IoStep {...props} />);

    await act(async () => {
      fireEvent.click(getByTestId('io-primary-button'));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_SELECTED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(openAppIoDownloadPage).toHaveBeenCalledTimes(1);
  });

  it('fires SEND_ONBOARDING_IO_ACTIVATION_SELECTED and SEND_ONBOARDING_IO_ACTIVATED when IO is enabled successfully', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(200, { result: 'OK' });

    const props = createProps(IOAllowedValues.DISABLED);
    const { getByTestId } = render(<IoStep {...props} />);

    await act(async () => {
      fireEvent.click(getByTestId('io-primary-button'));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_ACTIVATION_SELECTED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_ACTIVATED, {
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });
  });

  it('fires SEND_ONBOARDING_IO_DOWNLOAD_VERIFICATION when the refresh link is clicked', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);

    const props = createProps(undefined);
    const { getByTestId } = render(<IoStep {...props} />);

    await act(async () => {
      fireEvent.click(getByTestId('io-refresh-link'));
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_VERIFICATION,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
  });

  it('passes the selectedOnboardingFlow to the events when using COURTESY flow', () => {
    const props = createProps(undefined, OnboardingAvailableFlows.COURTESY);
    render(<IoStep {...props} />);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
    });
  });
});
