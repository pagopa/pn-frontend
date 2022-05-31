import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function testInput(form: HTMLFormElement, elementName: string, value: string) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.click(input!);
  userEvent.type(input!, value);
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

export const formTestValues = {
  testKey: 'someText',
  testKey2: 'anotherText',
  testKey3: 'thirdText',
};

export const formTestTouched = {
  testKey: true,
};

export const formTestErrors = {
  testKey: 'error',
};
