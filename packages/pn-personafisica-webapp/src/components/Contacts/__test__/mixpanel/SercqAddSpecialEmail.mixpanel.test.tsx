import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import SercqAddSpecialEmail from '../../SercqAddSpecialEmail';
import { fillCodeDialog } from '../test-utils';

const existingEmail = [
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@mail.it',
  },
];

describe('SercqAddSpecialEmail - Mixpanel events', () => {
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
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_START when a new email is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'new@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<SercqAddSpecialEmail />);
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'new@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_START
      );
    });
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_OTP when API requires OTP for new email', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'new@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<SercqAddSpecialEmail />);
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'new@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_OTP
      );
    });
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION and ADD_EMAIL_UX_SUCCESS on full add flow', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'new@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: 'new@mail.it',
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<SercqAddSpecialEmail />);
    const { container, getByRole } = result;
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'new@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS
      );
    });
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_BACK when the code dialog is closed (add flow)', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'new@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<SercqAddSpecialEmail />);
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'new@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_BACK
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_START when edit is clicked on existing email', () => {
    const { container } = render(<SercqAddSpecialEmail />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_START
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CANCEL when edit is cancelled', () => {
    const { container, getByRole } = render(<SercqAddSpecialEmail />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CANCEL
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CONTINUE when edit confirm is clicked', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'changed@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container } = render(<SercqAddSpecialEmail />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'changed@mail.it' } });
    await waitFor(() =>
      expect(getById(container, 'default_email')).toHaveValue('changed@mail.it')
    );
    fireEvent.click(getById(container, 'saveContact-default_email'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CONTINUE
      );
    });
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_OTP and CHANGE_EMAIL_UX_CONVERSION on change flow', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'changed@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: 'changed@mail.it',
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<SercqAddSpecialEmail />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    const { container } = result;
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'changed@mail.it' } });
    await waitFor(() =>
      expect(getById(container, 'default_email')).toHaveValue('changed@mail.it')
    );
    fireEvent.click(getById(container, 'saveContact-default_email'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_OTP
      );
    });

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_CONVERSION
      );
    });
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_BACK when code dialog is closed (change flow)', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'changed@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<SercqAddSpecialEmail />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'changed@mail.it' } });
    await waitFor(() =>
      expect(getById(container, 'default_email')).toHaveValue('changed@mail.it')
    );
    fireEvent.click(getById(container, 'saveContact-default_email'));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_BACK
    );
  });
});
