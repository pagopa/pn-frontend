import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import PecContactItem from '../../PecContactItem';
import { fillCodeDialog } from '../test-utils';

const VALID_PEC = 'pec@valida.com';

describe('PecContactItem - Mixpanel events', () => {
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
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  const submitPec = async () => {
    const result = render(<PecContactItem />);
    const input = result.container.querySelector('input[name="default_pec"]')!;
    fireEvent.change(input, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input).toHaveValue(VALID_PEC));
    fireEvent.click(result.getByTestId('default_pec-button'));
    return result;
  };

  it('fires SEND_ADD_PEC_START when the form is submitted', async () => {
    mock.onPost('/bff/v1/addresses/LEGAL/default/PEC').reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitPec();
    await waitFor(() => expect(mock.history.post).toHaveLength(1));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_PEC_START, expect.any(Object));
  });

  it('fires SEND_ADD_PEC_UX_CONVERSION when the verification code is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC, verificationCode: '01234' })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    const result = await submitPec();
    await fillCodeDialog(result);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_PEC_UX_CONVERSION, 'default');
  });

  it('fires SEND_ADD_PEC_UX_SUCCESS after verification code is accepted', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC, verificationCode: '01234' })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    const result = await submitPec();
    await fillCodeDialog(result);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_PEC_UX_SUCCESS,
        expect.any(Boolean)
      );
    });
  });

  it('fires SEND_ADD_PEC_CODE_ERROR when the verification code call fails', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(500);

    const result = render(
      <>
        <ResponseEventDispatcher />
        <PecContactItem />
      </>
    );

    const input = result.container.querySelector('input[name="default_pec"]')!;
    fireEvent.change(input, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input).toHaveValue(VALID_PEC));
    fireEvent.click(result.getByTestId('default_pec-button'));

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_PEC_CODE_ERROR);
    });
  });
});
