import { act, fireEvent, waitFor, screen, within, RenderResult } from '@testing-library/react'; // prettyDOM
import { NotificationAllowedStatus } from '../../../../utils/status.utility';
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

/*
async function testInput(form: HTMLFormElement, elementName: string, value: string | number) {
  const input = await form.querySelector(`input[name="${elementName}"]`);
  await waitFor(() => fireEvent.change(input!, {target: {value}}));
  expect(input).toHaveValue(value);
}
*/

describe('Filter Notifications Table Component', () => {
  let result: RenderResult;
  let form: HTMLFormElement;

  beforeEach(async () => {
    await act(async () => {
      result = render(<FilterNotificationsTable />);
      form = result.container.querySelector('form') as HTMLFormElement;
    });
  })

  it('renders filter notifications table', async () => {
    await act(async () => {
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
      testFormElementsValue(form, 'searchFor', '');
      testFormElementsValue(form, 'recipientId', '');
      testFormElementsValue(form, 'startDate', '');
      testFormElementsValue(form, 'endDate', '');
      testFormElementsValue(form, 'status', NotificationAllowedStatus[0].value);
    });
  });

  it('test searchFor select', async () => {
    await act(async () => {
      expect(form.querySelector(`input[name="recipientId"]`)).toBeInTheDocument();
      await testSelect(form, 'searchFor', [{label: 'Codice Fiscale', value: '0'}, {label: 'Codice IUN', value: '1'}]);
      expect(form.querySelector(`input[name="iunId"]`)).toBeInTheDocument();
    });
  });

  /*
  it('test recipientId input', async () => {
    await act(async () => {
      testInput(form, 'recipientId', 'mocked-recipientId');
    });
  });
  */

  /*
  it('test iunId input', async () => {
    await act(async () => {
      const selectButton = await waitFor(() => form.querySelector(`div[id="searchFor"]`));
      fireEvent.mouseDown(selectButton!);
      const selectOptionsContainer = await screen.findByRole('presentation');
      const selectOption = await within(selectOptionsContainer).findByText('Codice IUN');
      fireEvent.click(selectOption);
      testInput(form, 'iunId', 'mocked-iunId');
    });
  });
  */
});

// console.log(prettyDOM(cancelButton!, 100000));
