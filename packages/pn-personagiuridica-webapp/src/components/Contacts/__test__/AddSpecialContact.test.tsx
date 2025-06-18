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
  digitalAddressesPecValidation,
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

const handleContactDiscardMock = vi.fn();
const handleContactAddedMock = vi.fn();
const handleErrorMock = vi.fn();

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
      <AddSpecialContact
        ref={ref}
        handleContactAdded={handleSpecialContactAdded}
        handleError={handleErrorMock}
      />
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
    result.rerender(<SpecialContacts />);
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

  it('show already exist message', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    // render component
    const { container, getByTestId } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );

    // select sender
    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === specialAddresses[0].senderName),
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
    fireEvent.change(input, { target: { value: 'test@test.it' } });

    await waitFor(() => {
      expect(input).toHaveValue('test@test.it');
    });

    const alreadyExistsAlert = getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toBeInTheDocument();
  });

  it('show confirmation modal', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);

    // render component
    const { container, getByRole } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );

    // select sender
    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === 'Comune di Milano'),
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
    fireEvent.change(input, { target: { value: 'test@test.it' } });

    await waitFor(() => {
      expect(input).toHaveValue('test@test.it');
    });

    const disclaimerCheckbox = container.querySelector('[name="s_disclaimer"]');
    fireEvent.click(disclaimerCheckbox!);

    const confirmButton = getByRole('button', { name: 'conferma' });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      const dialog = getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      const titleEl = getById(dialog, 'confirmation-dialog-title');
      expect(titleEl).toBeInTheDocument();
      expect(titleEl).toHaveTextContent('special-contacts.legal-association-title');
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

  it('should not allow adding SERCQ while validating PEC', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId } = render(
      <AddSpecialContactWrapper handleSpecialContactAdded={handleContactAddedMock} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: [
              ...digitalAddressesPecValidation(true, true),
              ...digitalAddressesPecValidation(false, false, parties[1]),
            ],
          },
        },
      }
    );

    // select sender
    await testAutocomplete(
      container,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === parties[1].name),
      true
    );

    // select PEC addressType
    await testSelect(
      container,
      'channelType',
      channelTypesItems,
      channelTypesItems.findIndex((item) => item.value === ChannelType.SERCQ_SEND)
    );

    const validatingPecAlert = getByTestId('validatingPecForSenderAlert');
    expect(validatingPecAlert).toBeInTheDocument();
    expect(handleErrorMock).toHaveBeenCalledTimes(2);
    expect(handleErrorMock).toHaveBeenCalledWith(false);
    expect(handleErrorMock).toHaveBeenCalledWith(true);
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
});
