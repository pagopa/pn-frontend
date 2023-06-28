/* eslint-disable functional/no-let */
import { act, fireEvent, waitFor, screen, within, RenderResult } from '@testing-library/react';
import * as redux from 'react-redux';
import {
  formatToTimezoneString,
  getNextDay,
  getNotificationAllowedStatus,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { render, testFormElements, testInput, testSelect } from '../../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const localizedNotificationStatus = getNotificationAllowedStatus();

function formatDate(date: Date): string {
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}/${month}/${date.getFullYear()}`;
}

function testFormElementsValue(form: HTMLFormElement, elementName: string, value: any) {
  const formElement = form.querySelector(`input[name="${elementName}"]`);
  expect(formElement).toHaveValue(value);
}

async function testCalendar(form: HTMLFormElement, elementName: string) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  const button = input?.parentElement!.querySelector(`button`);
  fireEvent.click(button!);
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toBeInTheDocument();
  const dateButtonContainer = await within(dialog).findByRole(`grid`);
  const dateButton = dateButtonContainer.querySelector(`button`);
  const dateButtonValue = dateButton?.getAttribute('aria-label');
  fireEvent.click(dateButton!);
  const date = new Date(dateButtonValue as string);
  await waitFor(() => {
    expect(input).toHaveValue(formatDate(date));
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
  await testInput(form, 'startDate', formatDate(startDate));
  await testInput(form, 'endDate', formatDate(endDate));
  await testInput(form, 'status', status);
  iunMatch !== '' && (await testInput(form, 'iunMatch', iunMatch));
}

describe('Filter Notifications Table Component', () => {
  let result: RenderResult | undefined;
  let form: HTMLFormElement | undefined;
  let mockDispatchFn: jest.Mock;

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
      form = result.container.querySelector('form') as HTMLFormElement;
    });
  });

  afterEach(() => {
    result = undefined;
    form = undefined;
    jest.clearAllMocks();
  });

  it('renders filter notifications table', () => {
    expect(form).toBeInTheDocument();
    testFormElements(form!, 'recipientId', 'filters.fiscal-code-tax-code');
    testFormElements(form!, 'startDate', 'filters.data_da');
    testFormElements(form!, 'endDate', 'filters.data_a');
    testFormElements(form!, 'status', 'filters.status');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/button.filtra/i);
    const cancelButton = within(form!).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/button.annulla filtro/i);
  });

  it('test filters inital value', () => {
    testFormElementsValue(form!, 'recipientId', '');
    testFormElementsValue(form!, 'startDate', '');
    testFormElementsValue(form!, 'endDate', '');
    testFormElementsValue(form!, 'status', localizedNotificationStatus[0].value);
  });

  it('test recipientId input', async () => {
    await testInput(form!, 'recipientId', 'mocked-recipientId');
  });

  it('test iunMatch input', async () => {
    await testInput(form!, 'iunMatch', 'MOCK-EDIU-NMAT-CH');
  });

  it.skip('test startDate input', async () => {
    await testInput(form!, 'startDate', '23/02/2022');
    await testCalendar(form!, 'startDate');
  });

  it.skip('test endDate input', async () => {
    await testInput(form!, 'endDate', '23/02/2022');
    await testCalendar(form!, 'endDate');
  });

  it('test status select', async () => {
    expect(form!.querySelector(`input[name="status"]`)).toBeInTheDocument();
    await testSelect(form!, 'status', localizedNotificationStatus, 2);
  });

  it('test form submission - recipientId (valid)', async () => {
    const todayM = new Date();
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    todayM.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);

    await setFormValues(
      form!,
      oneYearAgo,
      todayM,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith({
      payload: {
        startDate: formatToTimezoneString(oneYearAgo),
        endDate: formatToTimezoneString(todayM),
        recipientId: 'RSSMRA80A01H501U',
        status: localizedNotificationStatus[2].value,
        iunMatch: '',
      },
      type: 'dashboardSlice/setNotificationFilters',
    });
  });

  it('test form submission - iunMatch (valid)', async () => {
    // NOTE: iunMatch field is automatically formatted at input
    const todayM = new Date();
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    todayM.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);

    await setFormValues(
      form!,
      oneYearAgo,
      todayM,
      localizedNotificationStatus[2].value,
      '',
      'ABCD-EFGH-ILMN-123456-A-1'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith({
      payload: {
        startDate: formatToTimezoneString(oneYearAgo),
        endDate: formatToTimezoneString(todayM),
        status: localizedNotificationStatus[2].value,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
        recipientId: '',
      },
      type: 'dashboardSlice/setNotificationFilters',
    });
  });

  it('test form submission - recipientId (invalid)', async () => {
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
      expect(mockDispatchFn).toBeCalledTimes(0);
    });
  });

  it('test form submission - iunMatch (invalid)', async () => {
    // NOTE: iunMatch field is automatically formatted at input

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
      expect(mockDispatchFn).toBeCalledTimes(0);
    });
  });

  it('valid date range', async () => {
    // NOTE: iunMatch field is automatically formatted at input
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    nineYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);

    // valid
    await setFormValues(
      form!,
      nineYearsAgo,
      oneYearAgo,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
  });

  it('test invalid date range - end before start', async () => {
    // NOTE: iunMatch field is automatically formatted at input
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
      expect(mockDispatchFn).toBeCalledTimes(0);
    });
  });

  it('test invalid date range - end in the future', async () => {
    // NOTE: iunMatch field is automatically formatted at input
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
      expect(mockDispatchFn).toBeCalledTimes(0);
    });
  });

  it('test form reset', async () => {
    const todayM = new Date();
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    const oneMonthAgo = new Date(new Date().setMonth(todayM.getMonth() - 1));
    oneYearAgo.setHours(0, 0, 0, 0);
    oneMonthAgo.setHours(0, 0, 0, 0);

    await setFormValues(
      form!,
      oneYearAgo,
      oneMonthAgo,
      localizedNotificationStatus[2].value,
      'RSSMRA80A01H501U',
      ''
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    const cancelButton = await waitFor(() => within(form!).getByTestId('cancelButton'));
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
          recipientId: '',
          status: '',
          iunMatch: '',
        },
        type: 'dashboardSlice/setNotificationFilters',
      });
    });
  });
});
