import { NotificationAllowedStatus } from '@pagopa-pn/pn-commons';
import { act, fireEvent, waitFor, screen, within } from '@testing-library/react'; // prettyDOM

import { render } from '../../../../__test__/test-utils';
import FilterNotificationsTable from '../FilterNotificationsTable';

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

async function testSelect(form: HTMLFormElement, elementName: string, options: Array<{label: string, value: string}>) {
  const selectInput = form.querySelector(`input[name="${elementName}"]`);
  const selectButton = await waitFor(() => form.querySelector(`div[id="${elementName}"]`));
  fireEvent.mouseDown(selectButton!);
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
    fireEvent.click(opt);
    expect(selectInput).toHaveValue(options[index].value);
  });
}

async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = await form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, {target: {value}});
  expect(input).toHaveValue(value);
}

async function testCalendar(form: HTMLFormElement, elementName: string) {
  const input = await form.querySelector(`input[name="${elementName}"]`);
  const button = await input?.parentElement!.querySelector(`button`);
  fireEvent.click(button!);
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toBeInTheDocument();
  const dateButtonContainer = await within(dialog).findByRole(`grid`);
  const dateButton = await dateButtonContainer.querySelector(`button`);
  const dateButtonValue = dateButton?.getAttribute('aria-label');
  fireEvent.click(dateButton!);
  const date = new Date(dateButtonValue as string);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  await waitFor(() => {
    expect(input).toHaveValue(`${day}/${month}/${date.getFullYear()}`);
    expect(dialog).not.toBeInTheDocument();
  })
}


describe('Filter Notifications Table Component', () => {
  it('renders filter notifications table', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      expect(form).toBeInTheDocument();
      testFormElements(form, 'searchFor', 'Cerca per');
      testFormElements(form, 'recipientId', 'Codice fiscale');
      testFormElements(form, 'startDate', 'Da');
      testFormElements(form, 'endDate', 'A');
      testFormElements(form, 'status', 'Stato');
      const submitButton = form.querySelector(`button[type="submit"]`);
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent(/Cerca/i);
      const cancelButton = form.querySelector(`button[id="cancelButton"]`);
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent(/Annulla ricerca/i);
    });
  });

  it.skip('test filters inital value', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      testFormElementsValue(form, 'searchFor', '');
      testFormElementsValue(form, 'recipientId', '');
      testFormElementsValue(form, 'startDate', '');
      testFormElementsValue(form, 'endDate', '');
      testFormElementsValue(form, 'status', NotificationAllowedStatus[0].value);
    });
  });

  it('test searchFor select', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      expect(form.querySelector(`input[name="recipientId"]`)).toBeInTheDocument();
      await testSelect(form, 'searchFor', [{label: 'Codice Fiscale', value: '0'}, {label: 'Codice IUN', value: '1'}]);
      expect(form.querySelector(`input[name="iunId"]`)).toBeInTheDocument();
    });
  });

  it('test recipientId input', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      testInput(form, 'recipientId', 'mocked-recipientId');
    });
  });

  it('test iunId input', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      const selectButton = await waitFor(() => form.querySelector(`div[id="searchFor"]`));
      fireEvent.mouseDown(selectButton!);
      const selectOptionsContainer = await screen.findByRole('presentation');
      const selectOption = await within(selectOptionsContainer).findByText('Codice IUN');
      fireEvent.click(selectOption);
      testInput(form, 'iunId', 'mocked-iunId');
    });
  });

  it('test startDate input', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      testInput(form, 'startDate', '23/02/2022');
      await testCalendar(form, 'startDate');
    });
  });

  it('test endDate input', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      testInput(form, 'endDate', '23/02/2022');
      await testCalendar(form, 'endDate');
    });
  });

  it('test status select', async () => {
    await act(async () => {
      const result = render(<FilterNotificationsTable />);
      const form = result.container.querySelector('form') as HTMLFormElement;
      expect(form.querySelector(`input[name="status"]`)).toBeInTheDocument();
      await testSelect(form, 'status', NotificationAllowedStatus);
    });
  });
});

// console.log(prettyDOM(cancelButton!, 100000));
