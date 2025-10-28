import { vi } from 'vitest';

import { CardSort } from '../../../models/PnCard';
import { Sort } from '../../../models/PnTable';
import {
  fireEvent,
  getById,
  queryById,
  render,
  screen,
  waitFor,
  within,
} from '../../../test-utils';
import MobileNotificationsSort from '../MobileNotificationsSort';

type MockOrderByFields = { 'mocked-field-1': string; 'mocked-field-2': string };

const sortFields: Array<CardSort<MockOrderByFields>> = [
  { id: 'mocked-field-1-asc', label: 'Mocked label 1 asc', value: 'asc', field: 'mocked-field-1' },
  {
    id: 'mocked-field-1-desc',
    label: 'Mocked label 1 desc',
    value: 'desc',
    field: 'mocked-field-1',
  },
  { id: 'mocked-field-2-asc', label: 'Mocked label 2 asc', value: 'asc', field: 'mocked-field-2' },
  {
    id: 'mocked-field-2-desc',
    label: 'Mocked label 2 desc',
    value: 'desc',
    field: 'mocked-field-2',
  },
];

const sort: Sort<MockOrderByFields> = {
  orderBy: '',
  order: 'asc',
};

const onChangeSortingMk = vi.fn();

describe('MobileNotifications Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders MobileNotificationsSort (closed)', () => {
    // render component
    const { getByTestId, container } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={sort}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const button = getByTestId('dialogToggleButton');
    expect(button).toHaveTextContent(/sort.title/i);
    // no badge
    const badge = queryById(container, 'dialogToggleBadge');
    expect(badge).not.toBeInTheDocument();
  });

  it('renders MobileNotificationsSort (opened)', async () => {
    // render component
    const { getByTestId } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={sort}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const button = getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/sort.title/i);
    const radioGroup = within(dialog!).getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels).toHaveLength(sortFields.length);
    radioLabels.forEach((label, index) => {
      expect(label).toHaveTextContent(sortFields[index].label);
    });
    const actions = within(dialog!).getAllByTestId('dialogAction');
    expect(actions).toHaveLength(2);
    expect(actions[0]).toHaveTextContent(/sort.title/i);
    expect(actions[1]).toHaveTextContent(/sort.cancel/i);
  });

  it('checks radioGroup initial value', async () => {
    // render component
    const { getByTestId } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={{ ...sort, orderBy: 'mocked-field-1' }}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const button = getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const radioGroup = within(dialog).getByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels[0].children[0].classList.contains('Mui-checked')).toBe(true);
  });

  it('changes radioGroup value', async () => {
    // render component
    const { getByTestId } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={{ ...sort, orderBy: 'mocked-field-1' }}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const button = getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const radioGroup = within(dialog).queryByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    expect(radioLabels![0].children[0].classList.contains('Mui-checked')).toBe(true);
    fireEvent.click(radioLabels![3]);
    await waitFor(() => {
      expect(radioLabels![0].children[0].classList.contains('Mui-checked')).not.toBe(true);
      expect(radioLabels![3].children[0].classList.contains('Mui-checked')).toBe(true);
    });
  });

  it('confirm sort', async () => {
    // render component
    const { getByTestId, container, rerender } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={sort}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const button = getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const radioGroup = within(dialog).getByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels[3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions[0]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: sortFields[3].field,
        order: sortFields[3].value,
      });
      expect(dialog).not.toBeInTheDocument();
    });
    // simulate rerendering due to sorting
    rerender(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={{ orderBy: sortFields[3].field, order: sortFields[3].value }}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    // badge
    const badge = getById(container, 'dialogToggleBadge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('1');
  });

  it('cancel sort', async () => {
    // render component
    const { getByTestId, container, rerender } = render(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={{ ...sort, orderBy: 'mocked-field-1' }}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    const badge = getById(container, 'dialogToggleBadge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('1');
    const button = getByTestId('dialogToggleButton');
    fireEvent.click(button);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const radioGroup = within(dialog).getByRole('radiogroup');
    const radioLabels = radioGroup?.querySelectorAll('label');
    fireEvent.click(radioLabels[3]);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"] > button');
    fireEvent.click(actions[1]);
    await waitFor(() => {
      expect(onChangeSortingMk).toBeCalledTimes(1);
      expect(onChangeSortingMk).toBeCalledWith({
        orderBy: '',
        order: 'asc',
      });
      expect(dialog).not.toBeInTheDocument();
    });
    // simulate rerendering due to sorting
    rerender(
      <MobileNotificationsSort
        sortFields={sortFields}
        sort={sort}
        onChangeSorting={onChangeSortingMk}
        title="sort.title"
        optionsTitle="sort.options"
        cancelLabel="sort.cancel"
      />
    );
    // no badge
    expect(badge).not.toBeInTheDocument();
  });
});
