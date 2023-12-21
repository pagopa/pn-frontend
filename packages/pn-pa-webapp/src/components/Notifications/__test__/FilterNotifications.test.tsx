import React from 'react';
import { vi } from 'vitest';

import {
  formatDate,
  formatToTimezoneString,
  getNotificationAllowedStatus,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import {
  createEvent,
  createMatchMedia,
  testFormElements,
  testInput,
  testSelect,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  getTestStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const localizedNotificationStatus = getNotificationAllowedStatus();

const initialState = {
  startDate: tenYearsAgo,
  endDate: today,
  recipientId: '',
  status: '',
  iunMatch: '',
};

async function testCalendar(form: HTMLFormElement, elementName: string) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  const button = input?.parentElement!.querySelector(`button`);
  fireEvent.click(button!);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  const dateButton = document.evaluate(
    `//button[text()="1"]`,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  fireEvent.click(dateButton.iterateNext()!);
  await waitFor(() => {
    expect(input).toHaveValue('01/02/2022');
    expect(dialog).not.toBeInTheDocument();
  });
}

async function setFormValues(
  form: HTMLFormElement,
  startDate: Date,
  endDate: Date,
  status: string,
  recipientId: string,
  iunMatch: string
) {
  recipientId !== '' && (await testInput(form, 'recipientId', recipientId));
  await testInput(form, 'startDate', formatDate(startDate.toISOString(), false));
  await testInput(form, 'endDate', formatDate(endDate.toISOString(), false));
  await testInput(form, 'status', status);
  iunMatch !== '' && (await testInput(form, 'iunMatch', iunMatch));
}

describe('Filter Notifications Table Component', () => {
  let result: RenderResult | undefined;
  let form: HTMLFormElement | undefined;

  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders filter notifications table - desktop', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    expect(form).toBeInTheDocument();
    testFormElements(form!, 'recipientId', 'filters.fiscal-code-tax-code', '');
    testFormElements(form!, 'startDate', 'filters.data_da', '');
    testFormElements(form!, 'endDate', 'filters.data_a', '');
    testFormElements(form!, 'status', 'filters.status', localizedNotificationStatus[0].value);
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/button.filtra/i);
    const cancelButton = within(form!).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/button.annulla filtro/i);
  });

  it('test recipientId input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form!, 'recipientId', 'mocked-recipientId');
  });

  it('test recipientId input onPaste event', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const inputRecipientId = form!.querySelector(`input[name="recipientId"]`);
    const paste = createEvent.paste(inputRecipientId!, {
      clipboardData: {
        getData: () => ' mocked-recipientId ',
      },
    });
    fireEvent(inputRecipientId!, paste);
    expect(inputRecipientId!).toHaveValue('mocked-recipientId');
  });

  it('test iunMatch input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form!, 'iunMatch', 'MOCK-EDIU-NMAT-CH');
  });

  it('test startDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form!, 'startDate', '23/02/2022');
    await testCalendar(form!, 'startDate');
  });

  it('test endDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form!, 'endDate', '23/02/2022');
    await testCalendar(form!, 'endDate');
  });

  it('test status select', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    expect(form!.querySelector(`input[name="status"]`)).toBeInTheDocument();
    await testSelect(form!, 'status', localizedNotificationStatus, 2);
  });

  it('test form submission - valid fields', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const tenYearsAgo = new Date(new Date().setMonth(today.getMonth() - 120));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    tenYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);
    await setFormValues(
      form!,
      tenYearsAgo,
      oneYearAgo,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      'ABCD-EFGH-ILMN-123456-A-1'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual({
        startDate: tenYearsAgo,
        endDate: oneYearAgo,
        recipientId: 'RSSMRA80A01H501U',
        status: localizedNotificationStatus[2].value,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
      });
    });
    // cancel filters
    const cancelButton = await waitFor(() => within(form!).getByTestId('cancelButton'));
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('test form submission - recipientId (invalid)', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    todayM.setHours(0, 0, 0, 0);
    nineYearsAgo.setHours(0, 0, 0, 0);
    // wrong id and wrong start date
    await setFormValues(
      form!,
      nineYearsAgo,
      todayM,
      localizedNotificationStatus[2].value,
      'mocked-wrongId',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
    });
    expect(form!).toHaveTextContent('filters.errors.fiscal-code');
  });

  // TO-FIX: il test fallisce perchè non viene visualizzato il messaggio di errore
  it.skip('test form submission - iunMatch (invalid)', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    todayM.setHours(0, 0, 0, 0);
    nineYearsAgo.setHours(0, 0, 0, 0);
    // wrong id and wrong start date
    await setFormValues(
      form!,
      nineYearsAgo,
      todayM,
      localizedNotificationStatus[2].value,
      '',
      '1234-5678-910A-BCDFGH-I-OL'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
    });
    expect(form!).toHaveTextContent('filters.errors.iun');
  });

  it('test invalid date range - end before start', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    nineYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);
    // wrong since endDate is before startDate
    await setFormValues(
      form!,
      oneYearAgo,
      nineYearsAgo,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('test invalid date range - end in the future', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const oneMonthAhead = new Date(new Date().setMonth(todayM.getMonth() + 1));
    todayM.setHours(0, 0, 0, 0);
    oneMonthAhead.setHours(0, 0, 0, 0);
    // wrong since endDate is before startDate
    await setFormValues(
      form!,
      todayM,
      oneMonthAhead,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('renders filter notifications table - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result?.container.querySelector('form') as HTMLFormElement;
    const button = result!.getByTestId('dialogToggleButton');
    fireEvent.click(button);
    expect(form).not.toBeInTheDocument(); // the desktop form
    const dialogForm = await waitFor(() => screen.getByTestId('filter-form'));
    expect(dialogForm).toBeInTheDocument();
  });

  it('test form submission - valid fields - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    nineYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);
    const button = result!.getByTestId('dialogToggleButton');
    fireEvent.click(button);
    let dialogForm = await waitFor(() => screen.getByTestId('filter-form') as HTMLFormElement);
    await setFormValues(
      dialogForm!,
      nineYearsAgo,
      oneYearAgo,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      'ABCD-EFGH-ILMN-123456-A-1'
    );
    const submitButton = dialogForm!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(getTestStore().getState().dashboardState.filters).toStrictEqual({
        startDate: nineYearsAgo,
        endDate: oneYearAgo,
        recipientId: 'RSSMRA80A01H501U',
        status: localizedNotificationStatus[2].value,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
      });
    });
    await waitFor(() => {
      expect(dialogForm).not.toBeInTheDocument();
      expect(result?.container).toHaveTextContent('5');
    });
    // cancel filters
    fireEvent.click(button);
    dialogForm = await waitFor(() => screen.getByTestId('filter-form') as HTMLFormElement);
    const cancelButton = within(dialogForm!).getByTestId('cancelButton');
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(dialogForm).not.toBeInTheDocument();
    });
    expect(getTestStore().getState().dashboardState.filters).toStrictEqual(initialState);
  });
});
