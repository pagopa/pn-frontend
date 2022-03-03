import { NotificationAllowedStatus } from '@pagopa-pn/pn-commons';
import { act, fireEvent, waitFor, screen, within } from '@testing-library/react'; // prettyDOM

import { render } from '../../../../__test__/test-utils';
import FilterNotificationsTable from '../FilterNotificationsTable';

function formatDate(date: Date): string {
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}/${month}/${date.getFullYear()}`;
}

function testFormElements(form: HTMLFormElement, elementName: string, label: string) {
  const formElement = form.querySelector(`input[name="${elementName}"]`);
  expect(formElement).toBeInTheDocument();
  const formElementLabel = form.querySelector(`label[for="${elementName}"]`);
  expect(formElementLabel).toBeInTheDocument();
  expect(formElementLabel).toHaveTextContent(label);
}

function testFormElementsValue(form: HTMLFormElement, elementName: string, value: any) {
  const formElement = form.querySelector(`input[name="${elementName}"]`);
  expect(formElement).toHaveValue(value);
}

async function testSelect(form: HTMLFormElement, elementName: string, options: Array<{label: string, value: string}>, optToSelect: number) {
  const selectInput = form.querySelector(`input[name="${elementName}"]`);
  const selectButton = form.querySelector(`div[id="${elementName}"]`);
  fireEvent.mouseDown(selectButton!);
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
  });
  await waitFor(() => {
    fireEvent.click(selectOptionsListItems[optToSelect]);
    expect(selectInput).toHaveValue(options[optToSelect].value);
  });
}

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  await waitFor(() => {
    fireEvent.change(input!, {target: {value}});
    expect(input).toHaveValue(value);
  });
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
  })
}

async function setFormValues(form: HTMLFormElement, searchFor: string, recipientId: string, startDate: Date, endDate: Date, status: string) {
  await testInput(form, 'searchFor', searchFor);
  await testInput(form, 'recipientId', recipientId);
  await testInput(form, 'startDate', formatDate(startDate));
  await testInput(form, 'endDate', formatDate(endDate));
  await testInput(form, 'status', status);
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
      result = render(<FilterNotificationsTable />);
      form = result.container.querySelector('form') as HTMLFormElement;
    });
  });

  afterEach(() => {
    result = undefined;
    form = undefined;
    jest.clearAllMocks();
  });

  it('renders filter notifications table', async () => {
    expect(form).toBeInTheDocument();
    testFormElements(form!, 'searchFor', 'Cerca per');
    testFormElements(form!, 'recipientId', 'Codice fiscale');
    testFormElements(form!, 'startDate', 'Da');
    testFormElements(form!, 'endDate', 'A');
    testFormElements(form!, 'status', 'Stato');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/Cerca/i);
    const cancelButton = await within(form!).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/Annulla ricerca/i);
  });

  it('test filters inital value', () => {
    testFormElementsValue(form!, 'searchFor', '');
    testFormElementsValue(form!, 'recipientId', '');
    testFormElementsValue(form!, 'startDate', '');
    testFormElementsValue(form!, 'endDate', '');
    testFormElementsValue(form!, 'status', NotificationAllowedStatus[0].value);
  });

  it('test searchFor select', async () => {
    expect(form!.querySelector(`input[name="recipientId"]`)).toBeInTheDocument();
    await testSelect(form!, 'searchFor', [{label: 'Codice Fiscale', value: '0'}, {label: 'Codice IUN', value: '1'}], 1);
    expect(form!.querySelector(`input[name="iunId"]`)).toBeInTheDocument();
  });

  it('test recipientId input', async () => {
    await testInput(form!, 'recipientId', 'mocked-recipientId');
  });

  it('test iunId input', async () => {
    const selectButton = form!.querySelector(`div[id="searchFor"]`);
    fireEvent.mouseDown(selectButton!);
    const selectOptionsContainer = await screen.findByRole('presentation');
    const selectOption = await within(selectOptionsContainer).findByText('Codice IUN');
    await waitFor(() => {
      fireEvent.click(selectOption);
    });
    await testInput(form!, 'iunId', 'mocked-iunId');
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

  it('test form submission (valid)', async () => {
    today.setUTCHours(23,0,0,0);
    const oneYearBefore = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    oneYearBefore.setUTCHours(23,0,0,0);

    await setFormValues(form!, '0', 'RSSMRA80A01H501U', oneYearBefore, today, NotificationAllowedStatus[2].value);
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith({
      payload: {
        startDate: oneYearBefore.toISOString(),
        endDate: today.toISOString(),
        recipientId: 'RSSMRA80A01H501U',
        status: NotificationAllowedStatus[2].value
      },
      type: 'setNotificationFilters'
    });
  });

  it('test form submission (invalid)', async () => {
    today.setUTCHours(23,0,0,0);
    const elevenYearsBefore = new Date(new Date().setFullYear(new Date().getFullYear() - 11));
    elevenYearsBefore.setUTCHours(23,0,0,0);

    // wrong id and wrong start date
    await setFormValues(form!, '0', 'mocked-wrongId', elevenYearsBefore, today, NotificationAllowedStatus[2].value);
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeDisabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
  });

  it('test form reset', async () => {
    today.setUTCHours(23,0,0,0);
    const oneYearBefore = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    oneYearBefore.setUTCHours(23,0,0,0);

    await setFormValues(form!, '0', 'RSSMRA80A01H501U', oneYearBefore, today, NotificationAllowedStatus[2].value);
    const cancelButton = await within(form!).getByTestId('cancelButton');
    await waitFor(() => {
      fireEvent.click(cancelButton!);
    });
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith({
      payload: {
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        recipientId: undefined,
        status: undefined
      },
      type: 'setNotificationFilters'
    });
    testFormElementsValue(form!, 'searchFor', '');
    testFormElementsValue(form!, 'recipientId', '');
    testFormElementsValue(form!, 'startDate', '');
    testFormElementsValue(form!, 'endDate', '');
    testFormElementsValue(form!, 'status', NotificationAllowedStatus[0].value);
  });
});
