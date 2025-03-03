import { formatDate, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import {
  createEvent,
  createMatchMedia,
  testCalendar,
  testFormElements,
  testInput,
} from '@pagopa-pn/pn-commons/src/test-utils';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

const initialState = {
  startDate: tenYearsAgo,
  endDate: today,
  iunMatch: '',
  mandateId: undefined,
};

async function setFormValues(
  form: HTMLFormElement,
  startDate: Date,
  endDate: Date,
  iunMatch: string,
  isMobile: boolean = false
) {
  if (isMobile) {
    await testCalendar(form, 'startDate', startDate, undefined, true);
    await testCalendar(form, 'endDate', endDate, undefined, true);
  } else {
    await testInput(form, 'startDate', formatDate(startDate.toISOString(), false));
    await testInput(form, 'endDate', formatDate(endDate.toISOString(), false));
  }
  await testInput(form, 'iunMatch', iunMatch);
}

describe('Filter Notifications Table Component', async () => {
  let result: RenderResult;
  let form: HTMLFormElement;

  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders filter notifications table - desktop', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    expect(form).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    testFormElements(form, 'iunMatch', 'filters.iun', '');
    testFormElements(form, 'startDate', 'filters.data_da', '');
    testFormElements(form, 'endDate', 'filters.data_a', '');
    const submitButton = form.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/button.filtra/i);
    const cancelButton = within(form).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent(/button.annulla filtro/i);
  });

  it('test iunMatch input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'iunMatch', 'MOCK-EDIU-NMAT-CH');
  });

  it('test iunMatch input onPaste event', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const inputIunMatch = form.querySelector(`input[name="iunMatch"]`);
    const paste = createEvent.paste(inputIunMatch!, {
      clipboardData: {
        getData: () => ' MOCK-EDIU-NMAT-CH ',
      },
    });
    fireEvent(inputIunMatch!, paste);
    expect(inputIunMatch!).toHaveValue('MOCK-EDIU-NMAT-CH');
  });

  it('test startDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'startDate', '23/02/2022');
    await testCalendar(form, 'startDate', new Date('2019-12-14'), new Date('2022-02-23'));
  }, 10000);

  it('test endDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'endDate', '23/02/2022');
    await testCalendar(form, 'endDate', new Date('2021-01-4'), new Date('2022-02-23'));
  }, 10000);

  it('test form submission - valid fields', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    nineYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);
    await setFormValues(form, nineYearsAgo, oneYearAgo, 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual({
        startDate: nineYearsAgo,
        endDate: oneYearAgo,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
        mandateId: undefined,
      });
    });
    // cancel filters
    const cancelButton = await waitFor(() => within(form).getByTestId('cancelButton'));
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('test form submission - iunMatch (invalid)', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    todayM.setHours(0, 0, 0, 0);
    nineYearsAgo.setHours(0, 0, 0, 0);
    // wrong id and wrong start date
    await setFormValues(form, nineYearsAgo, todayM, '1234-5678-910A-BCDFGH-I-OL');
    const submitButton = form.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual(initialState);
    });
    expect(form).toHaveTextContent('filters.errors.iun');
  });

  it('test invalid date range - end before start', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const nineYearsAgo = new Date(new Date().setMonth(todayM.getMonth() - 12 * 9));
    const oneYearAgo = new Date(new Date().setMonth(todayM.getMonth() - 12));
    nineYearsAgo.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);
    // wrong since endDate is before startDate
    await setFormValues(form, oneYearAgo, nineYearsAgo, 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('test invalid date range - end in the future', async () => {
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const todayM = new Date();
    const oneMonthAhead = new Date(new Date().setMonth(todayM.getMonth() + 1));
    todayM.setHours(0, 0, 0, 0);
    oneMonthAhead.setHours(0, 0, 0, 0);
    // wrong since endDate is before startDate
    await setFormValues(form, todayM, oneMonthAhead, 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form.querySelector(`button[type="submit"]`);
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual(initialState);
    });
  });

  it('renders filter notifications table - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    // render component
    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });
    form = result.container.querySelector('form') as HTMLFormElement;
    const button = result.getByTestId('dialogToggleButton');
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
    const button = result.getByTestId('dialogToggleButton');
    fireEvent.click(button);
    let dialogForm = await waitFor(() => screen.getByTestId<HTMLFormElement>('filter-form'));
    await setFormValues(dialogForm, nineYearsAgo, oneYearAgo, 'ABCD-EFGH-ILMN-123456-A-1', true);
    const submitButton = dialogForm.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(testStore.getState().dashboardState.filters).toStrictEqual({
        startDate: nineYearsAgo,
        endDate: oneYearAgo,
        iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
        mandateId: undefined,
      });
    });
    await waitFor(() => {
      expect(dialogForm).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent('3');
    });
    // cancel filters
    fireEvent.click(button);
    dialogForm = await waitFor(() => screen.getByTestId<HTMLFormElement>('filter-form'));
    const cancelButton = within(dialogForm).getByTestId('cancelButton');
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(dialogForm).not.toBeInTheDocument();
    });
    expect(testStore.getState().dashboardState.filters).toStrictEqual(initialState);
  });
});
