import { fireEvent, waitFor, screen, RenderResult, within } from "@testing-library/react";
import { CardSort, Sort } from "@pagopa-pn/pn-commons";

import { axe, render } from "../../../__test__/test-utils";
import MobileNotificationsSort from "../MobileNotificationsSort";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

const sortFields: Array<CardSort> = [
  {id: 'mocked-id-1-asc', label: 'Mocked label 1 asc', value: 'asc', field: 'mocked-field-1'},
  {id: 'mocked-id-1-desc', label: 'Mocked label 1 desc', value: 'desc', field: 'mocked-field-1'},
  {id: 'mocked-id-2-asc', label: 'Mocked label 2 asc', value: 'asc', field: 'mocked-field-2'},
  {id: 'mocked-id-2-desc', label: 'Mocked label 2 desc', value: 'desc', field: 'mocked-field-2'},
];

const sort: Sort = {
  orderBy: 'mocked-id-1',
  order: 'asc'
}

const onChangeSortingMk = jest.fn();

describe('MobileNotifications Component', () => {

  let result: RenderResult | undefined;

  beforeEach(() => {
    // render component
    result = render(<MobileNotificationsSort sortFields={sortFields} sort={sort} onChangeSorting={onChangeSortingMk}/>);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('renders MobileNotificationsSort (closed)', () => {
    const button = result?.container.querySelector('button');
    expect(button).toHaveTextContent(/sort.title/i);
  });

  it('renders MobileNotificationsSort (opened)', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/sort.title/i);
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels).toHaveLength(sortFields.length);
    radioLabels!.forEach((label, index) => {
      expect(label).toHaveTextContent(sortFields[index].label);
    });
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"]');
    expect(actions).toHaveLength(2);
    expect(actions![0]).toHaveTextContent(/sort.title/i);
    expect(actions![1]).toHaveTextContent(/sort.cancel/i);
  });

  it('checks radioGroup initial value', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels![0].children[0].classList.contains('Mui-checked')).toBe(true);
  });

  it('changes radioGroup value', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels![0].children[0].classList.contains('Mui-checked')).toBe(true);
    fireEvent.click(radioLabels![3]);
    await waitFor(() => {
      expect(radioLabels![0].children[0].classList.contains('Mui-checked')).not.toBe(true)
      expect(radioLabels![3].children[0].classList.contains('Mui-checked')).toBe(true)
    });
  });

  it('confirm sort', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels![3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions![0]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: sortFields[3].field,
        order: sortFields[3].value
      });
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('cancel sort', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels![3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions![1]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: '',
        order: 'asc'
      });
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

});