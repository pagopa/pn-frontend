import React from 'react';
import { fireEvent, waitFor, screen, RenderResult, within } from '@testing-library/react';
import { CardSort, Sort } from '../../../types';

import { render } from '../../../test-utils';
import MobileNotificationsSort from '../MobileNotificationsSort';

type MockOrderByFields = 'mocked-field-1' | 'mocked-field-2';

const sortFields: Array<CardSort<MockOrderByFields>> = [
  { id: 'mocked-field-1-asc', label: 'Mocked label 1 asc', value: 'asc', field: 'mocked-field-1' },
  { id: 'mocked-field-1-desc', label: 'Mocked label 1 desc', value: 'desc', field: 'mocked-field-1' },
  { id: 'mocked-field-2-asc', label: 'Mocked label 2 asc', value: 'asc', field: 'mocked-field-2' },
  { id: 'mocked-field-2-desc', label: 'Mocked label 2 desc', value: 'desc', field: 'mocked-field-2' },
];

const sort: Sort<MockOrderByFields> = {
  orderBy: 'mocked-field-1',
  order: 'asc',
};

const onChangeSortingMk = jest.fn();

describe('MobileNotifications Component', () => {
  let result: RenderResult | undefined;

  beforeEach(() => {
    // render component
    result = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={sort}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
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
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
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
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels![0].children[0].classList.contains('Mui-checked')).toBe(true);
  });

  it('changes radioGroup value', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels![0].children[0].classList.contains('Mui-checked')).toBe(true);
    fireEvent.click(radioLabels![3]);
    await waitFor(() => {
      expect(radioLabels![0].children[0].classList.contains('Mui-checked')).not.toBe(true);
      expect(radioLabels![3].children[0].classList.contains('Mui-checked')).toBe(true);
    });
  });

  it('confirm sort', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels![3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions![0]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: sortFields[3].field,
        order: sortFields[3].value,
      });
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('cancel sort', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
    const radioGroup = await within(dialog!).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels![3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions![1]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: '',
        order: 'asc',
      });
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
