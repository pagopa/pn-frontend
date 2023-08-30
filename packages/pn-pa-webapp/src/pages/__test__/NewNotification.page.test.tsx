import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { testSelect } from '@pagopa-pn/pn-commons';
import { RenderResult, act, fireEvent, waitFor, within } from '@testing-library/react';

import { newNotification, newNotificationGroups } from '../../__mocks__/NewNotification.mock';
import { render, testInput } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import { GroupStatus } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import NewNotification from '../NewNotification.page';

async function testRadio(form: HTMLFormElement, dataTestId: string, index: number) {
  const radioButtons = form?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  fireEvent.click(radioButtons[index]);
  await waitFor(() => {
    const radioInput = radioButtons[index].querySelector('input');
    expect(radioInput!).toBeChecked();
  });
}

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockIsPaymentEnabledGetter = jest.fn();
jest.mock('../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

const populateRecipientForm = async (form: HTMLFormElement) => {
  for (let i = 0; i < newNotification.recipients.length; i++) {
    const formRecipient = newNotification.recipients[i];
    await testInput(form, `recipients[${i}].firstName`, formRecipient.firstName);
    await testInput(form, `recipients[${i}].lastName`, formRecipient.lastName);
    await testInput(form, `recipients[${i}].taxId`, formRecipient.taxId);
    const checkbox = within(form).getByTestId(`showPhysicalAddress${i}`);
    fireEvent.click(checkbox!);
    await testInput(form, `recipients[${i}].address`, formRecipient.address);
    await testInput(form, `recipients[${i}].houseNumber`, formRecipient.houseNumber);
    await testInput(form, `recipients[${i}].municipality`, formRecipient.municipality);
    await testInput(form, `recipients[${i}].zip`, formRecipient.zip);
    await testInput(form, `recipients[${i}].province`, formRecipient.province);
    await testInput(form, `recipients[${i}].foreignState`, formRecipient.foreignState);
  }
};

const file = new File(['mocked content'], 'Mocked file', { type: 'application/pdf' });

const uploadDocument = async (elem: ParentNode, index: number) => {
  const nameInput = elem.querySelector(`[id="documents.${index}.name"]`);
  await waitFor(() => fireEvent.change(nameInput!, { target: { value: `Doc${index}` } }));
  const fileInput = elem.querySelector('[data-testid="fileInput"]');
  const input = fileInput?.querySelector('input');
  await waitFor(() => fireEvent.change(input!, { target: { files: [file] } }));
};

describe('NewNotification Page without payment', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(async () => {
    // render component
    mockIsPaymentEnabledGetter.mockReturnValue(false);
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, newNotificationGroups);
    await act(async () => {
      result = render(<NewNotification />);
    });
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NewNotification page', () => {
    expect(result?.getByTestId('titleBox')).toHaveTextContent('new-notification.title');
    const stepContent = result?.queryByTestId('preliminaryInformationsForm');
    expect(stepContent).toHaveTextContent(/title/i);
    const submitButton = result?.getByTestId('step-submit');
    expect(submitButton).toBeDisabled();
  });

  it('clicks on the breadcrumb button', async () => {
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/new-notification.breadcrumb-root/i);
    expect(links![0]).toHaveAttribute('href', routes.DASHBOARD);
  });

  it('create new notification process without payment methods', async () => {
    // Il test è reso semplice perché quelli dettagliati sono stati relegati ai singoli test degli step

    let submitButton: HTMLElement;
    let stepForm: HTMLFormElement;

    // START STEP 1 - preliminary informations
    stepForm = result?.getByTestId('preliminaryInformationsForm') as HTMLFormElement;
    expect(stepForm).toBeInTheDocument();
    submitButton = within(stepForm).getByTestId('step-submit');
    expect(submitButton).toHaveTextContent(/button.continue/i);
    expect(submitButton).toBeDisabled();
    await testInput(stepForm!, 'paProtocolNumber', 'mocked-NotificationId');
    await testInput(stepForm!, 'subject', 'mocked-Subject');
    await testInput(stepForm!, 'taxonomyCode', '012345N');
    await testSelect(
      stepForm!,
      'group',
      newNotificationGroups.map((g) => ({ label: g.name, value: g.id })),
      1
    );
    await testRadio(stepForm!, 'comunicationTypeRadio', 1);
    expect(submitButton).toBeEnabled();
    await waitFor(() => fireEvent.click(submitButton));
    // END STEP 1

    // START STEP 2
    stepForm = result?.getByTestId('recipientForm') as HTMLFormElement;
    expect(stepForm).toBeInTheDocument();
    submitButton = within(stepForm).getByTestId('step-submit');
    expect(submitButton).toHaveTextContent(/button.continue/i);
    expect(submitButton).toBeDisabled();
    const addButton = result!.queryByText('add-recipient');
    fireEvent.click(addButton!);
    await populateRecipientForm(stepForm);
    expect(submitButton).toBeEnabled();
    await waitFor(() => fireEvent.click(submitButton));
    // END STEP 2

    // START STEP 3
    stepForm = result?.getByTestId('attachmentsForm') as HTMLFormElement;
    expect(stepForm).toBeInTheDocument();
    submitButton = within(stepForm).getByTestId('step-submit');
    expect(submitButton).toHaveTextContent(/button.send/i);
    expect(submitButton).toBeDisabled();
    const attachmentBoxes = result?.queryAllByTestId('attachmentBox');
    await uploadDocument(attachmentBoxes![0].parentNode!, 0);
    expect(submitButton).toBeEnabled();

    // TO-DO Fare il mock di preload e upload di attachments e successivamente della creazione notifica
    // END STEP 3
  });

  /*
  PN-2028
  test('clicks on the api keys link', async () => {
    const links = result?.getAllByRole('link');
    expect(links![1]).toHaveTextContent(/menu.api-key/i);
    expect(links![1]).toHaveAttribute('href', routes.API_KEYS);
  });
  */
});
