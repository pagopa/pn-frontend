import React from 'react';

import { createMatchMedia, fireEvent, render, waitFor, screen } from '../../../test-utils';
import SmartFilter from '../SmartFilter';

const submitHandler = jest.fn();
const cancelHandler = jest.fn();

const field = [
  <input id="username" name="username" key="username"></input>,
  <input id="email" name="email" type="email" key="email"></input>,
];

describe('Smart Filter Component', () => {
  it('renders smart filters (desktop version)', () => {
    window.matchMedia = createMatchMedia(2000);
    const result = render(
      <SmartFilter
        filterLabel="Filter"
        cancelLabel="Cancel"
        formIsValid
        onClear={cancelHandler}
        onSubmit={submitHandler}
        formValues={{ username: '', email: '' }}
        initialValues={{ username: '', email: '' }}
      >
        {field}
      </SmartFilter>
    );
    const username = result.container.querySelector('#username');
    const email = result.container.querySelector('#email');
    const confirmButton = result.queryByTestId('confirmButton');
    const cancelButton = result.queryByTestId('cancelButton');
    const dialogToggle = result.queryByTestId('dialogToggle');
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent('Filter');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
    expect(cancelButton).toHaveTextContent('Cancel');
    expect(dialogToggle).not.toBeInTheDocument();
  });

  it('renders smart filters (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(
      <SmartFilter
        filterLabel="Filter"
        cancelLabel="Cancel"
        formIsValid
        onClear={cancelHandler}
        onSubmit={submitHandler}
        formValues={{ username: '', email: '' }}
        initialValues={{ username: '', email: '' }}
      >
        {field}
      </SmartFilter>
    );
    const username = result.container.querySelector('#username');
    const email = result.container.querySelector('#email');
    const confirmButton = result.queryByTestId('confirmButton');
    const cancelButton = result.queryByTestId('cancelButton');
    const dialogToggle = result.queryByTestId('dialogToggle');
    expect(username).not.toBeInTheDocument();
    expect(email).not.toBeInTheDocument();
    expect(confirmButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(dialogToggle).toBeInTheDocument();
    expect(dialogToggle).toHaveTextContent('Filter');
  });

  it('clicks on confirm and cancel buttons (desktop version)', () => {
    window.matchMedia = createMatchMedia(2000);
    const result = render(
      <SmartFilter
        filterLabel="Filter"
        cancelLabel="Cancel"
        formIsValid
        onClear={cancelHandler}
        onSubmit={submitHandler}
        formValues={{ username: 'mariorossi', email: 'mario.ossimail.it' }}
        initialValues={{ username: '', email: '' }}
      >
        {field}
      </SmartFilter>
    );
    const confirmButton = result.queryByTestId('confirmButton') as Element;
    const cancelButton = result.queryByTestId('cancelButton') as Element;
    expect(confirmButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();
    fireEvent.click(confirmButton);
    expect(submitHandler).toBeCalledTimes(1);
    fireEvent.click(cancelButton);
    expect(cancelHandler).toBeCalledTimes(1);
  });

  it('clicks on toggle button (mobile version)', async () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(
      <SmartFilter
        filterLabel="Filter"
        cancelLabel="Cancel"
        formIsValid
        onClear={cancelHandler}
        onSubmit={submitHandler}
        formValues={{ username: '', email: '' }}
        initialValues={{ username: '', email: '' }}
      >
        {field}
      </SmartFilter>
    );
    const dialogToggle = result.container.querySelector(
      '[data-testid="dialogToggle"] button'
    ) as Element;
    fireEvent.click(dialogToggle);
    await waitFor(() => {
      const dialog = screen.queryByTestId('mobileDialog') as Element;
      expect(dialog).toBeInTheDocument();
      const username = dialog.querySelector('#username');
      const email = dialog.querySelector('#email');
      const confirmButton = dialog.querySelector('[data-testid="confirmButton"]');
      const cancelButton = dialog.querySelector('[data-testid="cancelButton"]');
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
      expect(confirmButton).toBeDisabled();
      expect(confirmButton).toHaveTextContent('Filter');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toBeDisabled();
      expect(cancelButton).toHaveTextContent('Cancel');
    });
  });

  it('renders badge count (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(
      <SmartFilter
        filterLabel="Filter"
        cancelLabel="Cancel"
        formIsValid
        onClear={cancelHandler}
        onSubmit={submitHandler}
        formValues={{ username: 'mariorossi', email: 'mario.ossimail.it' }}
        initialValues={{ username: '', email: '' }}
      >
        {field}
      </SmartFilter>
    );
    const dialogToggle = result.queryByTestId('dialogToggle');
    expect(dialogToggle).toHaveTextContent('2');
  });
});
