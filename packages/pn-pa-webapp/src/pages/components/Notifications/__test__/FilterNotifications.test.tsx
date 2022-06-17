import { act, fireEvent, waitFor, screen, within, RenderResult } from '@testing-library/react';
import moment from 'moment';
import * as redux from 'react-redux';
import { NotificationAllowedStatus, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import {
  render,
  testFormElements,
  testInput,
  testSelect,
  axe,
} from '../../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

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
  searchFor: string,
  startDate: Date,
  endDate: Date,
  status: string,
  recipientId?: string,
  iunMatch?: string
) {
  await testInput(form, 'searchFor', searchFor);
  recipientId && (await testInput(form, 'recipientId', recipientId));
  await testInput(form, 'startDate', formatDate(startDate));
  await testInput(form, 'endDate', formatDate(endDate));
  await testInput(form, 'status', status);
  iunMatch && (await testInput(form, 'iunMatch', iunMatch));
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
      result = render(<FilterNotifications />);
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
    testFormElements(form!, 'searchFor', 'Filtra per');
    testFormElements(form!, 'recipientId', 'Codice Fiscale');
    testFormElements(form!, 'startDate', 'Da');
    testFormElements(form!, 'endDate', 'A');
    testFormElements(form!, 'status', 'Stato');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/Filtra/i);
    const cancelButton = within(form!).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/Rimuovi filtri/i);
  });

  it('test filters inital value', () => {
    testFormElementsValue(form!, 'searchFor', '0');
    testFormElementsValue(form!, 'recipientId', '');
    testFormElementsValue(form!, 'startDate', '');
    testFormElementsValue(form!, 'endDate', '');
    testFormElementsValue(form!, 'status', NotificationAllowedStatus[0].value);
  });

  it('test searchFor select', async () => {
    expect(form!.querySelector(`input[name="recipientId"]`)).toBeInTheDocument();
    await testSelect(
      form!,
      'searchFor',
      [
        { label: 'Codice Fiscale', value: '0' },
        { label: 'Codice IUN', value: '1' },
      ],
      1
    );
    expect(form!.querySelector(`input[name="iunMatch"]`)).toBeInTheDocument();
  });

  it('test recipientId input', async () => {
    await testInput(form!, 'recipientId', 'mocked-recipientId');
  });

  it('test iunMatch input', async () => {
    const selectButton = form!.querySelector(`div[id="searchFor"]`);
    fireEvent.mouseDown(selectButton!);
    const selectOptionsContainer = await screen.findByRole('presentation');
    const selectOption = await within(selectOptionsContainer).findByText('Codice IUN');
    await waitFor(() => {
      fireEvent.click(selectOption);
    });
    await testInput(form!, 'iunMatch', 'mocked-iunMatch');
  });

  it('test startDate input', async () => {
    await testInput(form!, 'startDate', '23/02/2022');
    await testCalendar(form!, 'startDate');
  });

  it('test endDate input', async () => {
    await testInput(form!, 'endDate', '23/02/2022');
    await testCalendar(form!, 'endDate');
  });

  it('test status select', async () => {
    expect(form!.querySelector(`input[name="status"]`)).toBeInTheDocument();
    await testSelect(form!, 'status', NotificationAllowedStatus, 2);
  });

  it('test form submission - searchFor codice fiscale (valid)', async () => {
    const oneYearAgo = moment().add(-1, 'year').startOf('day');
    const todayM = moment().startOf('day');

    await setFormValues(
      form!,
      '0',
      oneYearAgo.toDate(),
      todayM.toDate(),
      NotificationAllowedStatus[2].value,
      'RSSMRA80A01H501U'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith({
      payload: {
        startDate: oneYearAgo.toISOString(),
        endDate: todayM.toISOString(),
        recipientId: 'RSSMRA80A01H501U',
        status: NotificationAllowedStatus[2].value,
        iunMatch: undefined,
      },
      type: 'setNotificationFilters',
    });
  });

  it('test form submission - searchFor IUN (valid)', async () => {
    const oneYearAgo = moment().add(-1, 'year').startOf('day');
    const todayM = moment().startOf('day');

    await setFormValues(
      form!,
      '1',
      oneYearAgo.toDate(),
      todayM.toDate(),
      NotificationAllowedStatus[2].value,
      undefined,
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
        startDate: oneYearAgo.toISOString(),
        endDate: todayM.toISOString(),
        status: NotificationAllowedStatus[2].value,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
        recipientId: undefined,
      },
      type: 'setNotificationFilters',
    });
  });

  it('test form submission - search for codice fiscale (invalid)', async () => {
    const elevenYearsAgo = moment().add(-11, 'year').startOf('day');
    const todayM = moment().startOf('day');

    // wrong id and wrong start date
    await setFormValues(
      form!,
      '0',
      elevenYearsAgo.toDate(),
      todayM.toDate(),
      NotificationAllowedStatus[2].value,
      'mocked-wrongId'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeDisabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(0);
  });

  it('test form submission - search for codice IUN (invalid)', async () => {
    const elevenYearsAgo = moment().add(-11, 'year').startOf('day');
    const todayM = moment().startOf('day');

    // wrong id and wrong start date
    await setFormValues(
      form!,
      '1',
      elevenYearsAgo.toDate(),
      todayM.toDate(),
      NotificationAllowedStatus[2].value,
      undefined,
      '12345678910abcdfghiol'
    );
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeDisabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(0);
  });

  it.skip('test form reset', async () => {
    const oneYearAgo = moment().add(-1, 'year');
    const todayM = moment();
    await setFormValues(
      form!,
      '0',
      oneYearAgo.toDate(),
      todayM.toDate(),
      NotificationAllowedStatus[2].value,
      'RSSMRA80A01H501U'
    );
    
    const cancelButton = await waitFor(() => within(form!).getByTestId('cancelButton'));
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          startDate: tenYearsAgo.toISOString(),
          endDate: today.toISOString(),
          recipientId: undefined,
          status: undefined,
          iunMatch: undefined,
        },
        type: 'setNotificationFilters',
      });
    });
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
