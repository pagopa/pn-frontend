import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import {
  digitalLegalAddresses,
  digitalLegalAddressesSercq,
} from '../../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import LegalContacts from '../../LegalContacts';

// Default PEC only, no special legal contacts → delete dialog not blocked
const pecNoSpecials = digitalLegalAddresses.filter((addr) => addr.senderId === 'default');
// SERCQ only, no special legal contacts → delete dialog not blocked
const sercqNoSpecials = digitalLegalAddressesSercq.filter(
  (addr) => !(addr.addressType === AddressType.LEGAL && addr.senderId !== 'default')
);

describe('LegalContacts - Mixpanel events', () => {
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

  it('fires SEND_ADD_SERCQ_SEND_ENTER_FLOW when the start button is clicked', () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.start' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW,
      expect.any(Object)
    );
  });

  it('fires SEND_MANAGE_DIGITAL_DOMICILE when the manage button is clicked', () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: sercqNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.manage' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_MANAGE_DIGITAL_DOMICILE,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_SERCQ_SEND_START and SEND_REMOVE_SERCQ_SEND_POP_UP when the disable button is clicked', () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: sercqNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SERCQ_SEND_START,
      expect.any(Object)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_SERCQ_SEND_POP_UP_CANCEL when the SERCQ delete dialog is cancelled', async () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: sercqNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CANCEL,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_SERCQ_SEND_POP_UP_CONTINUE and SEND_REMOVE_SERCQ_SEND_SUCCESS and SEND_REMOVE_SERCQ_SEND_UX_SUCCESS after SERCQ is deleted', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/default/SERCQ_SEND').reply(204);
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: sercqNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(
      screen.getByRole('button', { name: 'legal-contacts.remove-sercq_send-confirm' })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CONTINUE,
      expect.any(Object)
    );
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_SERCQ_SEND_SUCCESS,
        'default'
      );
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_SERCQ_SEND_UX_SUCCESS,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_START and SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP when the PEC disable button is clicked', () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: pecNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_START,
      expect.any(Object)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL when the PEC delete dialog is cancelled', async () => {
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: pecNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE and SEND_REMOVE_PEC_SUCCESS and SEND_REMOVE_DIGITAL_DOMICILE_PEC_UX_SUCCESS after PEC is deleted', async () => {
    mock.onDelete('bff/v1/addresses/LEGAL/default/PEC').reply(200);
    render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: pecNoSpecials } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByRole('button', { name: 'legal-contacts.remove-pec-confirm' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE,
      expect.any(Object)
    );
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_REMOVE_PEC_SUCCESS, 'default');
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_UX_SUCCESS,
        expect.any(Object)
      );
    });
  });
});
