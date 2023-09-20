import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../__mocks__/Contacts.mock';
import { RenderResult, act, fireEvent, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import { CourtesyChannelType } from '../../models/contacts';
import { PROFILO } from '../../navigation/routes.const';
import { CONTACT_ACTIONS } from '../../redux/contact/actions';
import Contacts from '../Contacts.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('Contacts page', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it('renders Contacts (no contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = await render(<Contacts />);
    });
    expect(result?.container).toHaveTextContent(/title/i);
    expect(result?.container).toHaveTextContent(/subtitle/i);
    const insertLegalContact = result?.getByTestId('insertLegalContact');
    expect(insertLegalContact).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).not.toBeInTheDocument();
    const specialContact = result?.queryByTestId('specialContact');
    expect(specialContact).not.toBeInTheDocument();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain(CONTACTS_LIST());
  });

  it('renders Contacts (AppIO)', async () => {
    const appIO = digitalAddresses.courtesy.find(
      (addr) => addr.channelType === CourtesyChannelType.IOMSG
    );
    mock.onGet(CONTACTS_LIST()).reply(200, { courtesy: [appIO] });
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.getByTestId('insertLegalContact');
    expect(insertLegalContact).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).not.toBeInTheDocument();
    const specialContact = result?.queryByTestId('specialContact');
    expect(specialContact).not.toBeInTheDocument();
  });

  it('renders Contacts (legal contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, { legal: digitalAddresses.legal });
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.queryByTestId('insertLegalContact');
    expect(insertLegalContact).not.toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, { courtesy: digitalAddresses.courtesy });
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.getByTestId('insertLegalContact');
    expect(insertLegalContact).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).not.toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.queryByTestId('insertLegalContact');
    expect(insertLegalContact).not.toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('subtitle link properly redirects to profile page', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const subtitleLink = result?.getByText('subtitle-link-3');
    expect(subtitleLink).toBeInTheDocument();
    fireEvent.click(subtitleLink!);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(PROFILO);
  });

  it('API error', async () => {
    mock.onGet(CONTACTS_LIST()).reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Contacts />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
