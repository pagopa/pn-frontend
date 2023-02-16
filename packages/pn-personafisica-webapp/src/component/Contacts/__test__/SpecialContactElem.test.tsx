import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import { SpecialContactsProvider } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContactElem from '../SpecialContactElem';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('SpecialContactElem Component', () => {
  it('renders SpecialContactElem', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                mail: 'mocked@mail.it',
                pec: 'mocked@pec.it',
              }}
              senders={[{ id: 'mocked-senderId', name: 'Mocked Sender' }]}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result?.queryAllByTestId('specialContactForm');
    expect(specialContactForms).toHaveLength(2);
    expect(specialContactForms![0]).toHaveTextContent('mocked@pec.it');
    expect(result?.container).toHaveTextContent('-');
    expect(specialContactForms![1]).toHaveTextContent('mocked@mail.it');
    const firstFormButtons = specialContactForms![0].querySelectorAll('button');
    expect(firstFormButtons).toHaveLength(2);
    expect(firstFormButtons[0]).toHaveTextContent('button.modifica');
    expect(firstFormButtons[1]).toHaveTextContent('button.elimina');
    const secondFormButtons = specialContactForms![1].querySelectorAll('button');
    expect(secondFormButtons).toHaveLength(2);
    expect(secondFormButtons[0]).toHaveTextContent('button.modifica');
    expect(secondFormButtons[1]).toHaveTextContent('button.elimina');
  });

  it('changes a mail - new value valid', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                mail: 'mocked@mail.it',
                pec: 'mocked@pec.it',
              }}
              senders={[{ id: 'mocked-senderId', name: 'Mocked Sender' }]}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result?.queryAllByTestId('specialContactForm');
    const firstFormButtons = specialContactForms![0].querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => {
      return specialContactForms![0].querySelector('input');
    });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = specialContactForms![0].querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.long-mail-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.long-mail-123@456.it'));
    expect(newButtons![0]).toBeEnabled();
  });

  it('changes a mail - new value invalid', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                mail: 'mocked@mail.it',
                pec: 'mocked@pec.it',
              }}
              senders={[{ id: 'mocked-senderId', name: 'Mocked Sender' }]}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result?.queryAllByTestId('specialContactForm');
    const firstFormButtons = specialContactForms![0].querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => {
      return specialContactForms![0].querySelector('input');
    });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = specialContactForms![0].querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.bad.-mail-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.bad.-mail-123@456.it'));
    expect(newButtons![0]).toBeDisabled();
  });
});
