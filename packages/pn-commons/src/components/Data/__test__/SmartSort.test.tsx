import React from 'react';

import { fireEvent, render, waitFor, screen } from '../../../test-utils';
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
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog') as Element);
    expect(dialog).toBeInTheDocument();
    const options = dialog.querySelector('[role="radiogroup"]') as Element;
    expect(options).toBeInTheDocument();
    for (const field of sortFields) {
      const optionAsc = options.querySelector(`[aria-label="${field.label} Ascending"]`) as Element;
      expect(optionAsc).toBeInTheDocument();
      const optionDsc = options.querySelector(
        `[aria-label="${field.label} Descending"]`
      ) as Element;
      expect(optionDsc).toBeInTheDocument();
    }
    const confirmButton = dialog.querySelector('[data-testid="confirmButton"]');
    const cancelButton = dialog.querySelector('[data-testid="cancelButton"]');
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
    const dialogToggle = result.container.querySelector(
      '[data-testid="dialogToggle"] button'
    ) as Element;
    fireEvent.click(dialogToggle);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog') as Element);
    const options = dialog.querySelector('[role="radiogroup"]') as Element;
    const optionDsc = options.querySelector(`[aria-label="Surname Descending"]`) as Element;
    fireEvent.click(optionDsc);
    const confirmButton = await waitFor(() => {
      const confirmButton = dialog.querySelector('[data-testid="confirmButton"]') as Element;
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
    const dialogToggle = result.container.querySelector(
      '[data-testid="dialogToggle"] button'
    ) as Element;
    fireEvent.click(dialogToggle);
    const dialog = await waitFor(() => screen.queryByTestId('mobileDialog') as Element);
    const cancelButton = dialog.querySelector('[data-testid="cancelButton"]') as Element;
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
