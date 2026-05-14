import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import PecContactWizard from '../../PecContactWizard';
import { fillCodeDialog } from '../test-utils';

const VALID_PEC = 'test@pec.it';

describe('PecContactWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;
  const setShowPecWizard = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
    vi.clearAllMocks();
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_ENTER_PEC on mount', () => {
    render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ENTER_PEC,
      expect.any(Object)
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_BACK when the back button is clicked', () => {
    const { getByTestId } = render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    fireEvent.click(getByTestId('prev-button'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_BACK);
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_TOS_ACCEPTED when the disclaimer is checked', () => {
    const { container } = render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    fireEvent.click(container.querySelector('[name="disclaimer"]')!);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_ACCEPTED
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_TOS_DISMISSED when the disclaimer is unchecked', () => {
    const { container } = render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    const checkbox = container.querySelector('[name="disclaimer"]')!;
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_DISMISSED
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_ERROR when submit is clicked with invalid PEC', async () => {
    const { container, getByTestId } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizard} />
    );
    fireEvent.change(container.querySelector('[name="pec"]')!, {
      target: { value: 'invalid-pec' },
    });
    await waitFor(() =>
      expect(container.querySelector('[name="pec"]')).toHaveValue('invalid-pec')
    );
    fireEvent.click(getByTestId('next-button'));
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY and SEND_ADD_SERCQ_SEND_PEC_START_ACTIVATION when submit is clicked without disclaimer', async () => {
    const { container, getByTestId } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizard} />
    );
    fireEvent.change(container.querySelector('[name="pec"]')!, {
      target: { value: VALID_PEC },
    });
    await waitFor(() =>
      expect(container.querySelector('[name="pec"]')).toHaveValue(VALID_PEC)
    );
    fireEvent.click(getByTestId('next-button'));
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START_ACTIVATION,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_OTP and SEND_ADD_SERCQ_SEND_PEC_UX_CONVERSION on full OTP flow', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC, verificationCode: '01234' })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const result = render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    const { container, getByTestId } = result;

    fireEvent.change(container.querySelector('[name="pec"]')!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(container.querySelector('[name="pec"]')).toHaveValue(VALID_PEC));
    fireEvent.click(container.querySelector('[name="disclaimer"]')!);
    fireEvent.click(getByTestId('next-button'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP);
    });

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_CONVERSION
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_OTP_BACK when the code dialog is closed', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByTestId, getByRole } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizard} />
    );

    fireEvent.change(container.querySelector('[name="pec"]')!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(container.querySelector('[name="pec"]')).toHaveValue(VALID_PEC));
    fireEvent.click(container.querySelector('[name="disclaimer"]')!);
    fireEvent.click(getByTestId('next-button'));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP_BACK
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_UX_SUCCESS and SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE after successful activation', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC, verificationCode: '01234' })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const result = render(<PecContactWizard setShowPecWizard={setShowPecWizard} />);
    const { container, getByTestId } = result;

    fireEvent.change(container.querySelector('[name="pec"]')!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(container.querySelector('[name="pec"]')).toHaveValue(VALID_PEC));
    fireEvent.click(container.querySelector('[name="disclaimer"]')!);
    fireEvent.click(getByTestId('next-button'));

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_SUCCESS,
        expect.any(Object)
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE,
        expect.any(Object)
      );
    });
  });
});
