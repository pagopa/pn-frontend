import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalCourtesyAddresses } from '../../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { ChannelType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailContactItem from '../../EmailContactItem';
import { fillCodeDialog } from '../test-utils';

const VALID_EMAIL = 'test@example.com';
const defaultAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
)!;

describe('EmailContactItem - Mixpanel events', () => {
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

  const submitEmail = async (email = VALID_EMAIL) => {
    const result = render(<EmailContactItem />);
    const input = result.container.querySelector('[name="default_email"]')!;
    fireEvent.change(input, { target: { value: email } });
    await waitFor(() => expect(input).toHaveValue(email));
    fireEvent.click(result.getByTestId('default_email-button'));
    return result;
  };

  it('fires SEND_ADD_EMAIL_START when the form is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitEmail();
    await waitFor(() => expect(mock.history.post).toHaveLength(1));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_EMAIL_START,
      expect.objectContaining({ senderId: expect.any(String), source: expect.any(String) })
    );
  });

  it('fires SEND_ADD_EMAIL_OTP when the code dialog opens', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitEmail();
    await waitFor(() =>
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_EMAIL_OTP)
    );
  });

  it('fires SEND_ADD_EMAIL_UX_CONVERSION when the verification code is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: VALID_EMAIL,
        verificationCode: '01234',
      })
      .reply(204);
    const result = await submitEmail();
    await fillCodeDialog(result);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION, 'default');
  });

  it('fires SEND_ADD_EMAIL_UX_SUCCESS after the email is verified', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: VALID_EMAIL,
        verificationCode: '01234',
      })
      .reply(204);
    const result = await submitEmail();
    await fillCodeDialog(result);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
        expect.objectContaining({ senderId: expect.any(String), fromSercqSend: expect.any(Boolean) })
      );
    });
  });

  it('fires SEND_ADD_EMAIL_BACK when the code dialog is cancelled', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitEmail();
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_EMAIL_BACK);
  });

  it('fires SEND_CHANGE_EMAIL_START when the edit button is clicked', () => {
    const { container } = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    const editButton = container.querySelector('#modifyContact-default_email')!;
    fireEvent.click(editButton);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_CHANGE_EMAIL_START);
  });

  it('fires SEND_CHANGE_EMAIL_CANCEL when the edit is cancelled', () => {
    const { container } = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    const editButton = container.querySelector('#modifyContact-default_email')!;
    fireEvent.click(editButton);
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_CHANGE_EMAIL_CANCEL);
  });

  it('fires SEND_REMOVE_EMAIL_START and SEND_REMOVE_EMAIL_POP_UP when the disable button is clicked', () => {
    render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByTestId('disable-email'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_EMAIL_START,
      expect.objectContaining({ legal_addresses: expect.any(Array), event_type: expect.any(String) })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_EMAIL_POP_UP,
      expect.objectContaining({ legal_addresses: expect.any(Array), event_type: expect.any(String) })
    );
  });

  it('fires SEND_REMOVE_EMAIL_POP_UP_CANCEL when the delete dialog is cancelled', async () => {
    render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByTestId('disable-email'));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(dialog.querySelectorAll('button')[0]);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_EMAIL_POP_UP_CANCEL,
      expect.objectContaining({ legal_addresses: expect.any(Array), event_type: expect.any(String) })
    );
  });

  it('fires SEND_REMOVE_EMAIL_UX_SUCCESS after the email is deleted', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
    render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByTestId('disable-email'));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(dialog.querySelectorAll('button')[1]);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_EMAIL_UX_SUCCESS,
        expect.objectContaining({ legal_addresses: expect.any(Array), event_type: expect.any(String) })
      );
    });
  });

  it('fires SEND_ADD_EMAIL_CODE_ERROR when the verification code call fails', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: VALID_EMAIL })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: VALID_EMAIL,
        verificationCode: '01234',
      })
      .reply(500);

    const result = render(
      <>
        <ResponseEventDispatcher />
        <EmailContactItem />
      </>
    );

    const input = result.container.querySelector('[name="default_email"]')!;
    fireEvent.change(input, { target: { value: VALID_EMAIL } });
    await waitFor(() => expect(input).toHaveValue(VALID_EMAIL));
    fireEvent.click(result.getByTestId('default_email-button'));

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR);
    });
  });
});
