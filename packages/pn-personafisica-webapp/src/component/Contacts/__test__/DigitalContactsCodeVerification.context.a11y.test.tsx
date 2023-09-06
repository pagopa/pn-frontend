import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  axe,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import {
  Component,
  mockContactsApi,
  pecValue,
  pecValueToVerify,
  senderId,
  showDialog,
} from './DigitalContactsCodeVerification.context.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test manca il test di accessibilità sulla modale che compare in fase di inserimento di un contatto già eistente.
Il componente, infatti, si trova in pn-commons e qualora sia necessario un test di accessibilità, è giusto farlo li

Andrea Cimini - 6/09/2023
*/
describe('DigitalContactsCodeVerification Context - accessibility tests', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    result = undefined;
  });

  afterAll(() => {
    mock.restore();
  });

  it('does not have basic accessibility issues (modal closed)', async () => {
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (modal opened)', async () => {
    mockContactsApi(mock, LegalChannelType.PEC, pecValue, senderId);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!, mock, pecValue);
    expect(dialog).toBeInTheDocument();
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (pec to verify)', async () => {
    mockContactsApi(mock, LegalChannelType.PEC, pecValueToVerify, senderId, true);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValueToVerify} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!, mock, pecValueToVerify);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const validationDialog = result.getByTestId('validationDialog');
    expect(validationDialog).toBeInTheDocument();
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (try to add an already existing contact)', async () => {
    mockContactsApi(
      mock,
      CourtesyChannelType.EMAIL,
      digitalAddresses.courtesy[0].value,
      'another-sender-id'
    );
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component
          type={CourtesyChannelType.EMAIL}
          value={digitalAddresses.courtesy[0].value}
          senderId={'another-sender-id'}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    const duplicateDialog = await waitFor(() => result?.getByTestId('duplicateDialog'));
    expect(duplicateDialog).toBeInTheDocument();
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
