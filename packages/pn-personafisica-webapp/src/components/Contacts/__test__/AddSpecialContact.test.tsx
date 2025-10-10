import MockAdapter from 'axios-mock-adapter';
import React, { useRef } from 'react';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import {
  getById,
  queryById,
  testAutocomplete,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  digitalAddresses,
  digitalAddressesSercq,
  digitalLegalAddresses,
} from '../../../__mocks__/Contacts.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { act, fireEvent, render, screen, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { CONTACT_ACTIONS } from '../../../redux/contact/actions';
import AddSpecialContact from '../AddSpecialContact';
import SpecialContacts from '../SpecialContacts';
import { fillCodeDialog } from './test-utils';

const specialAddresses = digitalLegalAddresses.filter((addr) => addr.senderId !== 'default');

const digitalAddressesWithInvalidPec = digitalAddresses.map((addr) =>
  addr.senderName === 'Comune di Milano' && addr.channelType === ChannelType.PEC
    ? { ...addr, pecValid: false }
    : addr
);

const handleContactDiscardMock = vi.fn();
const handleContactAddedMock = vi.fn();

interface AddSpecialContactRef {
  handleConfirm: () => Promise<void>;
}

const channelTypesItems = [
  { label: 'special-contacts.pec', value: ChannelType.PEC },
  { label: 'special-contacts.sercq_send', value: ChannelType.SERCQ_SEND },
];

const AddSpecialContactWrapper: React.FC<{
  handleSpecialContactAdded: () => void;
}> = ({ handleSpecialContactAdded }) => {
  const ref = useRef<AddSpecialContactRef>(null);

  const handleConfirm = () => {
    ref.current?.handleConfirm();
  };

  return (
    <>
      <AddSpecialContact ref={ref} handleContactAdded={handleSpecialContactAdded} />
      <button data-testid="prev-button" color={'primary'} onClick={handleContactDiscardMock}>
        indietro
      </button>
      <button data-testid="prev-button" color={'primary'} onClick={handleConfirm}>
        conferma
      </button>
    </>
  );
};

describe('test AddSpecialContact', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId, getByText, queryByTestId } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );

    const title = getByText('special-contacts.add-title');
    expect(title).toBeInTheDocument();
    const description = getByText('special-contacts.contact-to-add-description');
    expect(description).toBeInTheDocument();
    const senderLabel = getById(container, 'sender-label');
    expect(senderLabel).toBeInTheDocument();
    expect(senderLabel).toHaveTextContent('special-contacts.add-sender');
    const senderInput = getById(container, 'sender');
    expect(senderInput).toBeInTheDocument();
    expect(senderInput).toHaveValue('');
    const senderAutoComplete = getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();
    const channelTypeLabel = getById(container, 'channelType-label');
    expect(channelTypeLabel).toBeInTheDocument();
    expect(channelTypeLabel).toHaveTextContent('special-contacts.select-address');
    const input = queryById(container, 's_value');
    expect(input).not.toBeInTheDocument();
    const alreadyExistsAlert = queryByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).not.toBeInTheDocument();
  });

  it('insert address', async () => {
    const pecValue = 'mocked@pec.it';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, {
        value: pecValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[2].id}/PEC`, {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
      }
    );

    // select sender
    await testAutocomplete(result.container, 'sender', parties, true, 2, true);

    // select addressType
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );

    const input = getById(result.container, 's_value');

    // fill with invalid value
    fireEvent.change(input, { target: { value: 'invalid value' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid value');
    });
    let errorMessage = getById(result.container, `s_value-helper-text`);
    expect(errorMessage).toBeInTheDocument();

    // fill with valid value
    fireEvent.change(input, { target: { value: pecValue } });
    await waitFor(() => {
      expect(input).toHaveValue(pecValue);
    });
    expect(errorMessage).not.toBeInTheDocument();

    const discardButton = result.getByRole('button', { name: 'indietro' });
    const confirmButton = result.getByRole('button', { name: 'conferma' });
    expect(confirmButton).toBeInTheDocument();

    // verify "back" button
    fireEvent.click(discardButton);
    await waitFor(() => {
      expect(handleContactDiscardMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(confirmButton);

    const disclaimerCheckbox = result.container.querySelector('[name="s_disclaimer"]');

    // check disclaimer error
    errorMessage = getById(result.container, `s_disclaimer-helper-text`);
    expect(errorMessage).toBeInTheDocument();

    fireEvent.click(disclaimerCheckbox!);
    await waitFor(() => {
      expect(errorMessage).not.toBeInTheDocument();
    });

    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const addresses = [
      ...digitalLegalAddresses,
      {
        senderName: parties[2].name,
        value: pecValue,
        pecValid: true,
        senderId: parties[2].id,
        addressType: AddressType.LEGAL,
        channelType: ChannelType.PEC,
        codeValid: true,
      },
    ];

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // simulate rerendering due to redux changes
    result.rerender(<SpecialContacts addressType={AddressType.LEGAL} />);
    await waitFor(() => {
      // contacts list
      const specialContactForms = result.getAllByTestId(
        /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
      );
      expect(specialContactForms).toHaveLength(specialAddresses.length + 1);
    });

    await waitFor(() => {
      expect(handleContactAddedMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should show all channelType options if PEC is default address and no default SERCQ is present', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    // render component
    const { container } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );

    await testSelect(
      container,
      'channelType',
      [
        { value: ChannelType.PEC, label: 'special-contacts.pec' },
        { value: ChannelType.SERCQ_SEND, label: 'special-contacts.sercq_send' },
      ],
      0
    );
  });

  it('should show PEC input if SERCQ is default address', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId, queryByText } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses: digitalAddressesSercq } },
      }
    );

    const senderLabel = getById(container, 'sender-label');
    expect(senderLabel).toBeInTheDocument();
    expect(senderLabel).toHaveTextContent('special-contacts.add-sender');
    const senderInput = getById(container, 'sender');
    expect(senderInput).toBeInTheDocument();
    expect(senderInput).toHaveValue('');
    const senderAutoComplete = getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();

    const channelTypeCaption = queryByText('special-contacts.contact-to-add');
    expect(channelTypeCaption).not.toBeInTheDocument();
    const channelTypeLabel = queryById(container, 'channelType-label');
    expect(channelTypeLabel).not.toBeInTheDocument();

    const pecLabel = getById(container, 's_value-label');
    expect(pecLabel).toBeInTheDocument();
    expect(pecLabel).toHaveTextContent('special-contacts.link-pec-label');
    const pecInput = getById(container, 's_value');
    expect(pecInput).toBeInTheDocument();
    expect(pecInput).toHaveValue('');
  });

  it('show validating PEC error and banner selecting a sender having PEC in validation', async () => {
    const pecValue = 'test@test.it';
    const sender = specialAddresses[0];
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    mock
      .onPost(`/bff/v1/addresses/LEGAL/${sender.senderId}/PEC`, {
        value: pecValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });

    mock.onPost(`/bff/v1/addresses/LEGAL/${sender.senderId}/PEC`, {
      value: pecValue,
      verificationCode: '01234',
    });

    // render component
    const { container, getByRole, getByTestId, getByText, queryByText } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses: digitalAddressesWithInvalidPec } },
      }
    );

    let error = queryByText('special-contacts.validating-pec-error-message');
    expect(error).not.toBeInTheDocument();

    // select sender
    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === sender.senderName),
      true
    );

    error = getByText('special-contacts.validating-pec-error-message');
    expect(error).toBeInTheDocument();
    expect(error).toBeVisible();

    const confirmButton = getByRole('button', { name: 'conferma' });
    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(confirmButton);

    const validatingPecAlert = getByTestId('validatingPecForSenderAlert');
    expect(validatingPecAlert).toBeInTheDocument();
    expect(validatingPecAlert).toHaveTextContent('special-contacts.validating-pec-banner-content');

    // select PEC addressType
    await testSelect(
      container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );

    const input = getById(container, 's_value');
    fireEvent.change(input, { target: { value: pecValue } });

    await waitFor(() => {
      expect(input).toHaveValue(pecValue);
    });

    fireEvent.click(confirmButton);

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toBe('/bff/v1/pa-list');
    expect(mock.history.get[1].url).toBe('/bff/v1/pa-list?paNameFilter=Comune+di+Milano');

    // no api call to override validating PEC
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });
  });

  it('shows "already exists" banner if the selected sender already has a PEC', async () => {
    const pecValue = 'test@test.it';
    const sender = specialAddresses[0];
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    mock
      .onPost(`/bff/v1/addresses/LEGAL/${sender.senderId}/PEC`, {
        value: pecValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });

    mock.onPost(`/bff/v1/addresses/LEGAL/${sender.senderId}/PEC`, {
      value: pecValue,
      verificationCode: '01234',
    });

    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    const { container, getByRole, getByTestId } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses,
          },
        },
      }
    );

    expect(container.querySelector('[data-testid="alreadyExistsAlert"]')).not.toBeInTheDocument();

    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === sender.senderName),
      true
    );

    const banner = getByTestId('alreadyExistsAlert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('special-contacts.contact-already-exists');

    // select PEC addressType
    await testSelect(
      container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );

    const input = getById(container, 's_value');
    fireEvent.change(input, { target: { value: pecValue } });

    await waitFor(() => {
      expect(input).toHaveValue(pecValue);
    });

    const confirmButton = getByRole('button', { name: 'conferma' });
    fireEvent.click(confirmButton);

    const errorMessage = container.querySelector(`#s_disclaimer-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('required-field');

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });

    const checkbox = getById(container, 's_disclaimer');

    fireEvent.click(checkbox);
    expect(errorMessage).toBeInTheDocument();

    fireEvent.click(confirmButton);

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toBe('/bff/v1/pa-list');

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
  });

  it('shows "existing contact dialog" adding same as "default" PEC address', async () => {
    const pecValue = digitalAddresses[0].value;
    const sender = specialAddresses[0];
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    mock
      .onPost(`/bff/v1/addresses/LEGAL/${sender.senderId}/PEC`, {
        value: pecValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });

    const { container, getByRole, getByTestId, getByText } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses,
          },
        },
      }
    );

    expect(container.querySelector('[data-testid="alreadyExistsAlert"]')).not.toBeInTheDocument();

    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === sender.senderName),
      true
    );

    // select PEC addressType
    await testSelect(
      container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.PEC)
    );

    const input = getById(container, 's_value');
    fireEvent.change(input, { target: { value: pecValue } });

    await waitFor(() => {
      expect(input).toHaveValue(pecValue);
    });

    const checkbox = getById(container, 's_disclaimer');
    fireEvent.click(checkbox);

    const confirmButton = getByRole('button', { name: 'conferma' });
    fireEvent.click(confirmButton);

    let confirmDialog: HTMLElement;
    await waitFor(() => {
      confirmDialog = getByTestId('confirmationDialog');
      expect(confirmDialog).toBeInTheDocument();
    });

    const dialogConfirmButton = getByText('button.understand');
    fireEvent.click(dialogConfirmButton);

    await waitFor(() => {
      expect(confirmDialog).not.toBeInTheDocument();
    });

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toBe('/bff/v1/pa-list');

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });
  });

  it('API error', async () => {
    mock.onGet(/\/bff\/v1\/pa-list.*/).reply(errorMock.status, errorMock.data);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />
        </>,
        {
          preloadedState: { contactsState: { digitalAddresses } },
        }
      );
    });

    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it.only('insert sercq with exist courtesy email', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    // render component
    const result = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalLegalAddresses,
          },
        },
      }
    );

    // select sender
    await testAutocomplete(result.container, 'sender', parties, true, 2, true);

    // select addressType
    await testSelect(
      result.container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.SERCQ_SEND)
    );

    const dialogContactEl = result.getByTestId(`defaultEmail`);
    await waitFor(() => {
      expect(dialogContactEl).toBeInTheDocument();
    });

    // const input = getById(result.container, 's_value');

    // // fill with invalid value
    // fireEvent.change(input, { target: { value: 'invalid value' } });
    // await waitFor(() => {
    //   expect(input).toHaveValue('invalid value');
    // });
    // let errorMessage = getById(result.container, `s_value-helper-text`);
    // expect(errorMessage).toBeInTheDocument();

    // // fill with valid value
    // fireEvent.change(input, { target: { value: emailValue } });
    // await waitFor(() => {
    //   expect(input).toHaveValue(emailValue);
    // });
    // expect(errorMessage).not.toBeInTheDocument();

    // const discardButton = result.getByRole('button', { name: 'indietro' });
    // const confirmButton = result.getByRole('button', { name: 'conferma' });
    // expect(confirmButton).toBeInTheDocument();

    // // verify "back" button
    // fireEvent.click(discardButton);
    // await waitFor(() => {
    //   expect(handleContactDiscardMock).toHaveBeenCalledTimes(1);
    // });

    // fireEvent.click(confirmButton);

    // const disclaimerCheckbox = result.container.querySelector('[name="s_disclaimer"]');

    // // check disclaimer error
    // errorMessage = getById(result.container, `s_disclaimer-helper-text`);
    // expect(errorMessage).toBeInTheDocument();

    // fireEvent.click(disclaimerCheckbox!);
    // await waitFor(() => {
    //   expect(errorMessage).not.toBeInTheDocument();
    // });

    // fireEvent.click(confirmButton);
    // await waitFor(() => {
    //   expect(mock.history.post).toHaveLength(1);
    //   expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
    //     value: emailValue,
    //   });
    // });
    // const dialog = await fillCodeDialog(result);
    // await waitFor(() => {
    //   expect(mock.history.post).toHaveLength(2);
    //   expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
    //     value: emailValue,
    //     verificationCode: '01234',
    //   });
    // });
    // await waitFor(() => {
    //   expect(dialog).not.toBeInTheDocument();
    // });
    // const addresses = [
    //   ...digitalLegalAddresses,
    //   {
    //     senderName: parties[2].name,
    //     value: emailValue,
    //     pecValid: true,
    //     senderId: parties[2].id,
    //     addressType: AddressType.LEGAL,
    //     channelType: ChannelType.PEC,
    //     codeValid: true,
    //   },
    // ];

    // expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(addresses);
    // // simulate rerendering due to redux changes
    // result.rerender(<SpecialContacts addressType={AddressType.LEGAL} />);
    // await waitFor(() => {
    //   // contacts list
    //   const specialContactForms = result.getAllByTestId(
    //     /^[a-zA-Z0-9-]+(?:_pecSpecialContact|_sercq_sendSpecialContact)$/
    //   );
    //   expect(specialContactForms).toHaveLength(specialAddresses.length + 1);
    // });

    // await waitFor(() => {
    //   expect(handleContactAddedMock).toHaveBeenCalledTimes(1);
    // });
  });
});
