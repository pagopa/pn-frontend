import { fireEvent, waitFor, screen, within, RenderResult, act } from '@testing-library/react';
import moment from 'moment';
import * as redux from 'react-redux';
import { tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { axe, render } from '../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

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

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
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
  });
}

async function setFormValues(
  form: HTMLFormElement,
  startDate: Date,
  endDate: Date,
  iunMatch: string
) {
  await testInput(form, 'startDate', formatDate(startDate));
  await testInput(form, 'endDate', formatDate(endDate));
  await testInput(form, 'iunMatch', iunMatch);
}

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

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
    testFormElements(form!, 'iunMatch', 'filters.iun');
    testFormElements(form!, 'startDate', 'filters.data_da');
    testFormElements(form!, 'endDate', 'filters.data_a');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/button.filtra/i);
    const cancelButton = within(form!).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/button.annulla filtro/i);
  });

  it('test filters inital value', () => {
    testFormElementsValue(form!, 'iunMatch', '');
    testFormElementsValue(form!, 'startDate', '');
    testFormElementsValue(form!, 'endDate', '');
  });

  it('test iunMatch input', async () => {
    await testInput(form!, 'iunMatch', 'mocked-iunMatch');
  });

  it('test startDate input', async () => {
    await testInput(form!, 'startDate', '23/02/2022');
    await testCalendar(form!, 'startDate');
  });

  it('test endDate input', async () => {
    await testInput(form!, 'endDate', '23/02/2022');
    await testCalendar(form!, 'endDate');
  }, 10000);

  it('test form submission - iunMatch (valid)', async () => {
    const oneYearAgo = moment().add(-1, 'year').startOf('day');
    const todayM = moment().startOf('day');
    await setFormValues(form!, oneYearAgo.toDate(), todayM.toDate(), 'ABCD-EFGH-ILMN-123456-A-1');
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
        status: undefined,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
      },
      type: 'setNotificationFilters',
    });
  });

  it('test form submission - iunMatch (invalid)', async () => {
    const elevenYearsAgo = moment().add(-11, 'year').startOf('day');
    const todayM = moment().startOf('day');

    // wrong id and wrong start date
    await setFormValues(form!, elevenYearsAgo.toDate(), todayM.toDate(), '12345678910abcdfghiol');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeDisabled();
    await waitFor(() => {
      fireEvent.click(submitButton!);
    });
    expect(mockDispatchFn).toBeCalledTimes(0);
  });

  it('test form reset', async () => {
    const oneYearAgo = moment().add(-1, 'year');
    const todayM = moment();
    await setFormValues(form!, oneYearAgo.toDate(), todayM.toDate(), 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    const cancelButton = await waitFor(() => within(form!).getByTestId('cancelButton'));
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          startDate: tenYearsAgo.toISOString(),
          endDate: today.toISOString(),
          iunMatch: undefined,
        },
        type: 'setNotificationFilters',
      });
    });
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
