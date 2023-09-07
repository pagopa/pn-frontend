import React from 'react';

import { createMatchMedia, fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import SmartFilter from '../SmartFilter';

const submitHandler = jest.fn();
const cancelHandler = jest.fn();

const ExampleForm = ({ inputUsername = '', inputEmail = '' }) => {
  const [username, setUsername] = React.useState(inputUsername);
  const [email, setEmail] = React.useState(inputEmail);
  return (
    <SmartFilter
      filterLabel="Filter"
      cancelLabel="Cancel"
      formIsValid
      onClear={cancelHandler}
      onSubmit={(e) => {
        e?.preventDefault();
        submitHandler();
      }}
      formValues={{ username, email }}
      initialValues={{ username: '', email: '' }}
    >
      <input
        data-testid="username"
        id="username"
        name="username"
        key="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        data-testid="email"
        id="email"
        name="email"
        type="email"
        key="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
    </SmartFilter>
  );
};

describe('Smart Filter Component', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders smart filters (desktop version)', () => {
    const result = render(<ExampleForm />);
    const username = result.getByTestId('username');
    const email = result.getByTestId('email');
    const confirmButton = result.getByTestId('confirmButton');
    const cancelButton = result.getByTestId('cancelButton');
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

  it('clicks on confirm button (desktop version)', async () => {
    const result = render(<ExampleForm />);
    const username = result.getByTestId('username');
    const email = result.getByTestId('email');
    fireEvent.change(username, { target: { value: 'mariorossi' } });
    fireEvent.change(email, { target: { value: 'mario.rossi@mail.it' } });
    const confirmButton = await waitFor(() => result.getByTestId('confirmButton') as Element);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    expect(submitHandler).toBeCalledTimes(1);
  });

  it('clicks on cancel button (desktop version)', async () => {
    const result = render(
      <ExampleForm inputUsername="mariorossi" inputEmail="mario.rossimail.it" />
    );
    const cancelButton = result.queryByTestId('cancelButton') as Element;
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    expect(cancelHandler).toBeCalledTimes(1);
  });

  it('renders smart filters (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(<ExampleForm />);
    const username = result.queryByTestId('username');
    const email = result.queryByTestId('email');
    const confirmButton = result.queryByTestId('confirmButton');
    const cancelButton = result.queryByTestId('cancelButton');
    const dialogToggle = result.getByTestId('dialogToggle');
    expect(username).not.toBeInTheDocument();
    expect(email).not.toBeInTheDocument();
    expect(confirmButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(dialogToggle).toBeInTheDocument();
    expect(dialogToggle).toHaveTextContent('Filter');
  });

  it('clicks on toggle button (mobile version)', async () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(<ExampleForm />);
    const dialogToggle = result.getByTestId('dialogToggleButton');
    fireEvent.click(dialogToggle);
    await waitFor(() => {
      const dialog = screen.getByTestId('mobileDialog');
      expect(dialog).toBeInTheDocument();
      const username = within(dialog).getByTestId('username');
      const email = within(dialog).getByTestId('email');
      const confirmButton = within(dialog).getByTestId('confirmButton');
      const cancelButton = within(dialog).getByTestId('cancelButton');
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

  it('renders badge count (mobile version)', async () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(
      <ExampleForm inputUsername="mariorossi" inputEmail="mario.rossimail.it" />
    );
    const dialogToggle = await waitFor(() => result.getByTestId('dialogToggle'));
    expect(dialogToggle).toHaveTextContent('2');
  });
});
