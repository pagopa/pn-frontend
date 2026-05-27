import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { digitalLegalAddresses } from '../../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import SpecialContacts from '../../SpecialContacts';

const specialLegalAddresses = digitalLegalAddresses.filter((addr) => addr.senderId !== 'default');
const firstSenderId = specialLegalAddresses[0].senderId;

describe('SpecialContacts - Mixpanel events', () => {
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

  const renderSpecialPec = () =>
    render(<SpecialContacts addressType={AddressType.LEGAL} />, {
      preloadedState: { contactsState: { digitalAddresses: specialLegalAddresses } },
    });

  it('fires SEND_ADD_PEC_START when a special PEC form is submitted', async () => {
    const VALID_PEC = 'new@pec.it';
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${firstSenderId}/PEC`, { value: VALID_PEC })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const result = renderSpecialPec();
    const editButton = result.container.querySelector(`#modifyContact-${firstSenderId}_pec`)!;
    fireEvent.click(editButton);

    const input = result.container.querySelector(`[name="${firstSenderId}_pec"]`)!;
    fireEvent.change(input, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input).toHaveValue(VALID_PEC));

    const saveButton = result.container.querySelector(`#saveContact-${firstSenderId}_pec`)!;
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_PEC_START,
        expect.objectContaining({ senderId: expect.any(String), source: expect.any(String) })
      );
    });
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_START and SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP when PEC delete is clicked', () => {
    const result = renderSpecialPec();
    const firstForm = result.getAllByTestId(/^[a-zA-Z0-9-]+_pecSpecialContact$/)[0];
    fireEvent.click(within(firstForm).getByRole('button', { name: 'button.elimina' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_START,
      expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array), other_contact: expect.any(Boolean) })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP,
      expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array), other_contact: expect.any(Boolean) })
    );
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL when the delete dialog is cancelled', async () => {
    const result = renderSpecialPec();
    const firstForm = result.getAllByTestId(/^[a-zA-Z0-9-]+_pecSpecialContact$/)[0];
    fireEvent.click(within(firstForm).getByRole('button', { name: 'button.elimina' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // secondary button [0] = cancel → fires handleCloseModal → SEND_REMOVE_..._POP_UP_CANCEL
    fireEvent.click(dialog.querySelectorAll('button')[0]);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL,
      expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array), other_contact: expect.any(Boolean) })
    );
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE, SEND_REMOVE_PEC_SUCCESS and SEND_REMOVE_DIGITAL_DOMICILE_PEC_UX_SUCCESS after deletion', async () => {
    mock.onDelete(`/bff/v1/addresses/LEGAL/${firstSenderId}/PEC`).reply(200);

    const result = renderSpecialPec();
    const firstForm = result.getAllByTestId(/^[a-zA-Z0-9-]+_pecSpecialContact$/)[0];
    fireEvent.click(within(firstForm).getByRole('button', { name: 'button.elimina' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // primary button [1] = confirm → fires deleteConfirmHandler
    fireEvent.click(dialog.querySelectorAll('button')[1]);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE,
      expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array), other_contact: expect.any(Boolean) })
    );
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_PEC_SUCCESS,
        firstSenderId
      );
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_UX_SUCCESS,
        expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array), other_contact: expect.any(Boolean) })
      );
    });
  });
});
