import { act, fireEvent, RenderResult, waitFor, screen } from "@testing-library/react";
import { ContactsApi } from "../../../api/contacts/Contacts.api";

import { render } from "../../../__test__/test-utils";
import InsertLegalContact from "../InsertLegalContact";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: () => 'legal-contacts.pec-verify-descr',
}));


describe('InsertLegalContact component', () => {

  let result: RenderResult | undefined;

  beforeEach(async () => {
    // mock api
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateLegalAddress');
    apiSpy.mockResolvedValue(void 0);

    await act(async () => {
      result = render(<InsertLegalContact recipientId={'mocked-recipientId'}/>)
    });
  })
  
  afterEach(() => {
    result = undefined;
  })

  it('renders InsertLegalContact', () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    expect(cardBody).toHaveTextContent('legal-contacts.title');
    expect(cardBody).toHaveTextContent('legal-contacts.subtitle');
    expect(cardBody).toHaveTextContent('legal-contacts.description');
    const disclaimerList = cardBody?.querySelector('ul');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.save-money');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.avoid-waste');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.fast-notification');
    const radioButtons = cardBody?.querySelectorAll('[data-testid="digitalDomicileTypeRadio"]');
    expect(radioButtons).toHaveLength(2);
    expect(radioButtons![0]).toHaveTextContent('legal-contacts.link-pec');
    const radioInput = radioButtons![0].querySelector('input');
    expect(radioInput!).toBeChecked();
    expect(radioButtons![1]).toHaveTextContent('legal-contacts.link-io');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    expect(pecInput!).toHaveValue('');
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('checks invalid pec', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, {target: {value: 'mail-errata'}});
    await waitFor(() => expect(pecInput!).toHaveValue('mail-errata'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('checks valid pec', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, {target: {value: 'mail@valida.mail'}});
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.mail'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeEnabled();
  });

  it('clicks on confirm button', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, {target: {value: 'mail@valida.mail'}});
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.mail'));
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    const button = cardActions?.querySelector('button');
    fireEvent.click(button!);
    await waitFor(() => {
      const dialog = screen.queryByTestId('codeDialog');
      expect(dialog).not.toBeInTheDocument();
    })
  });
});