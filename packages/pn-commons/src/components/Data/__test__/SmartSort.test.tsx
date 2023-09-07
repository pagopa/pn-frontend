import React from 'react';

import { fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import SmartSort from '../SmartSort';

const sortingHandler = jest.fn();

const sortFields = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'surname',
    label: 'Surname',
  },
  {
    id: 'country',
    label: 'Country',
  },
];

describe('Smart Sort Component', () => {
  it('renders smart sort', () => {
    const result = render(
      <SmartSort
        title="Sort"
        optionsTitle="Options"
        cancelLabel="Cancel"
        ascLabel="Ascending"
        dscLabel="Descending"
        sort={{
          orderBy: '',
          order: 'asc',
        }}
        sortFields={sortFields}
        onChangeSorting={sortingHandler}
      />
    );
    const dialogToggle = result.queryByTestId('dialogToggle');
    expect(dialogToggle).toBeInTheDocument();
    expect(dialogToggle).toHaveTextContent('Sort');
  });

  it('clicks on toggle button', async () => {
    const result = render(
      <SmartSort
        title="Sort"
        optionsTitle="Options"
        cancelLabel="Cancel"
        ascLabel="Ascending"
        dscLabel="Descending"
        sort={{
          orderBy: '',
          order: 'asc',
        }}
        sortFields={sortFields}
        onChangeSorting={sortingHandler}
      />
    );
    const dialogToggle = result.container.querySelector(
      '[data-testid="dialogToggle"] button'
    ) as Element;
    fireEvent.click(dialogToggle);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    const options = within(dialog).getAllByRole('radiogroup')[0];
    expect(options).toBeInTheDocument();
    for (const field of sortFields) {
      const optionAsc = within(options).getAllByLabelText(`${field.label} Ascending`)[0];
      expect(optionAsc).toBeInTheDocument();
      const optionDsc = within(options).getAllByLabelText(`${field.label} Descending`)[0];
      expect(optionDsc).toBeInTheDocument();
    }
    const confirmButton = within(dialog).getByTestId('confirmButton');
    const cancelButton = within(dialog).getByTestId('cancelButton');
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent('Sort');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    expect(cancelButton).toHaveTextContent('Cancel');
  });

  it('clicks on confirm button', async () => {
    const result = render(
      <SmartSort
        title="Sort"
        optionsTitle="Options"
        cancelLabel="Cancel"
        ascLabel="Ascending"
        dscLabel="Descending"
        sort={{
          orderBy: '',
          order: 'asc',
        }}
        sortFields={sortFields}
        onChangeSorting={sortingHandler}
      />
    );
    const dialogToggle = result.getByTestId('dialogToggleButton');
    fireEvent.click(dialogToggle);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const options = within(dialog).getAllByRole('radiogroup')[0];
    const optionDsc = within(options).getAllByLabelText('Surname Descending')[0];
    fireEvent.click(optionDsc);
    const confirmButton = await waitFor(() => {
      const confirmButton = within(dialog).getByTestId('confirmButton');
      expect(confirmButton).toBeEnabled();
      return confirmButton;
    });
    fireEvent.click(confirmButton);
    expect(sortingHandler).toBeCalledTimes(1);
    expect(sortingHandler).toBeCalledWith({
      orderBy: 'surname',
      order: 'desc',
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(/Sort1/);
    });
  });

  it('clicks on cancel button', async () => {
    const result = render(
      <SmartSort
        title="Sort"
        optionsTitle="Options"
        cancelLabel="Cancel"
        ascLabel="Ascending"
        dscLabel="Descending"
        sort={{
          orderBy: 'country',
          order: 'asc',
        }}
        sortFields={sortFields}
        onChangeSorting={sortingHandler}
      />
    );
    const dialogToggle = result.getByTestId('dialogToggleButton');
    fireEvent.click(dialogToggle);
    const dialog = await waitFor(() => screen.getByTestId('mobileDialog'));
    const cancelButton = within(dialog).getByTestId('cancelButton');
    fireEvent.click(cancelButton);
    expect(sortingHandler).toBeCalledTimes(1);
    expect(sortingHandler).toBeCalledWith({
      orderBy: '',
      order: 'asc',
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(result.container).not.toHaveTextContent(/Sort1/);
    });
  });
});
