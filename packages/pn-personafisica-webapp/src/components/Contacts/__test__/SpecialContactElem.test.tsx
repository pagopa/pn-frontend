import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { SpecialContactsProvider } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import SpecialContactElem from '../SpecialContactElem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe.skip('SpecialContactElem Component', () => {
  let mock: MockAdapter;

  const pecAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.PEC,
    value: 'mocked@pec.it',
    pecValid: true,
  };

  const emailAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.EMAIL,
    value: 'mocked@mail.it',
  };

  const phoneAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.SMS,
    value: '+39333333333',
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders SpecialContactElem', () => {
    // render component
    const { container, getAllByTestId } = render(
      <SpecialContactsProvider>
        <SpecialContactElem addresses={[pecAddress, emailAddress]} />
      </SpecialContactsProvider>
    );

    expect(container).toHaveTextContent('Mocked Sender');
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    expect(specialContactForms).toHaveLength(2);
    expect(specialContactForms[0]).toHaveTextContent('mocked@pec.it');
    expect(specialContactForms[1]).toHaveTextContent('mocked@mail.it');
    const firstFormButtons = specialContactForms[0].querySelectorAll('button');
    expect(firstFormButtons).toHaveLength(2);
    expect(firstFormButtons[0]).toHaveTextContent('button.modifica');
    expect(firstFormButtons[1]).toHaveTextContent('button.elimina');
    const secondFormButtons = specialContactForms[1].querySelectorAll('button');
    expect(secondFormButtons).toHaveLength(2);
    expect(secondFormButtons[0]).toHaveTextContent('button.modifica');
    expect(secondFormButtons[1]).toHaveTextContent('button.elimina');
    expect(container).toHaveTextContent('-');
  });

  it('Edits one contacts and checks that others are disabled', async () => {
    // render component
    const { getAllByTestId } = render(
      <SpecialContactsProvider>
        <SpecialContactElem addresses={[pecAddress, phoneAddress]} />
        <SpecialContactElem
          addresses={[
            {
              addressType: AddressType.COURTESY,
              senderId: 'another-mocked-senderId',
              senderName: 'Another mocked Sender',
              channelType: ChannelType.EMAIL,
              value: 'mocked@mail.it',
            },
            {
              addressType: AddressType.COURTESY,
              senderId: 'another-mocked-senderId',
              senderName: 'Another mocked Sender',
              channelType: ChannelType.SMS,
              value: '+39333333334',
            },
          ]}
        />
      </SpecialContactsProvider>
    );
    // edit the first contact of the first row
    const specialContactForms = getAllByTestId(
      /^[a-zA-Z0-9\-]+(?:_pecContact|_emailContact|_smsContact)$/
    );
    let firstFormButtons = specialContactForms[0].querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    let input = await waitFor(() => specialContactForms[0].querySelector('input'));
    firstFormButtons = specialContactForms[0].querySelectorAll('button');
    expect(input).toBeInTheDocument();
    // check the disabled status of the others button
    const secondFormButtons = specialContactForms[1].querySelectorAll('button');
    for (const button of secondFormButtons) {
      expect(button).toBeDisabled();
    }
    const thirdFormButtons = specialContactForms[2].querySelectorAll('button');
    for (const button of thirdFormButtons) {
      expect(button).toBeDisabled();
    }
    const fourthFormButtons = specialContactForms[3].querySelectorAll('button');
    for (const button of fourthFormButtons) {
      expect(button).toBeDisabled();
    }
    // exit from edit
    fireEvent.click(firstFormButtons[1]);
    input = await waitFor(() => specialContactForms[0].querySelector('input'));
    expect(input).not.toBeInTheDocument();
    // check the disabled status of the others button
    for (const button of secondFormButtons) {
      expect(button).toBeEnabled();
    }
    for (const button of thirdFormButtons) {
      expect(button).toBeEnabled();
    }
    for (const button of fourthFormButtons) {
      expect(button).toBeEnabled();
    }
  });
});
