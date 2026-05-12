import MockAdapter from 'axios-mock-adapter';
import React, { useRef } from 'react';
import { MockInstance, vi } from 'vitest';

import { testAutocomplete, testSelect } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../../__mocks__/Contacts.mock';
import { parties } from '../../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { ChannelType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import AddSpecialContact from '../../AddSpecialContact';
import { fillCodeDialog } from '../test-utils';

interface AddSpecialContactRef {
  handleConfirm: () => Promise<void>;
}

const AddSpecialContactWrapper: React.FC<{ handleContactAdded?: () => void }> = ({
  handleContactAdded = vi.fn(),
}) => {
  const ref = useRef<AddSpecialContactRef>(null);
  return (
    <>
      <AddSpecialContact ref={ref} handleContactAdded={handleContactAdded} />
      <button data-testid="confirm-btn" onClick={() => ref.current?.handleConfirm()}>
        conferma
      </button>
    </>
  );
};

const channelTypesItems = [
  { label: 'special-contacts.pec', value: ChannelType.PEC },
  { label: 'special-contacts.sercq_send', value: ChannelType.SERCQ_SEND },
];

describe('AddSpecialContact - Mixpanel events', () => {
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

  it('fires SEND_CUSTOMIZE_CONTACT on mount', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_CUSTOMIZE_CONTACT,
      expect.any(Object)
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_START when the channel type is changed', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const result = render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_START,
      expect.any(Object)
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_TOS_ACCEPTED when the TOS checkbox is checked', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const result = render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );
    const checkbox = result.container.querySelector('[name="s_disclaimer"]')!;
    fireEvent.click(checkbox);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_ACCEPTED);
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_TOS_DISMISSEDD when the TOS checkbox is unchecked', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const result = render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );
    const checkbox = result.container.querySelector('[name="s_disclaimer"]')!;
    fireEvent.click(checkbox); // check
    fireEvent.click(checkbox); // uncheck
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_DISMISSEDD
    );
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT_UX_CONVERSION when the confirm button is clicked', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });
    fireEvent.click(screen.getByTestId('confirm-btn'));
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_UX_CONVERSION,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_ADD_PEC_START, SEND_ADD_PEC_UX_CONVERSION, SEND_ADD_CUSTOMIZED_CONTACT_UX_SUCCESS and SEND_ADD_PEC_UX_SUCCESS for the full PEC add flow', async () => {
    const pecValue = 'special@pec.it';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, { value: pecValue })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<AddSpecialContactWrapper />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses, parties: [] } },
    });

    await testAutocomplete(result.container, 'sender', parties, true, 2, true);
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );

    const pecInput = result.container.querySelector('[name="s_value"]')!;
    fireEvent.change(pecInput, { target: { value: pecValue } });
    await waitFor(() => expect(pecInput).toHaveValue(pecValue));

    const checkbox = result.container.querySelector('[name="s_disclaimer"]')!;
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_PEC_START,
        expect.any(Object)
      );
    });

    await fillCodeDialog(result);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
      parties[2].id
    );

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_UX_SUCCESS,
        expect.any(Object)
      );
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_PEC_UX_SUCCESS, false);
    });
  });

  // SEND_ADD_PEC_CODE_ERROR fires via AppResponsePublisher (ContactCodeDialog subscribes to
  // createOrUpdateAddress/rejected). Requires AppResponsePublisher setup — not testable at this level.
});
