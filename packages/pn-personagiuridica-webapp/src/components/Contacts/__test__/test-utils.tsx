import userEvent from '@testing-library/user-event';

import { RenderResult, waitFor, within } from '../../../__test__/test-utils';

export const fillCodeDialog = async (result: RenderResult, code: string = '01234') => {
  const dialog = await waitFor(() => result.getByTestId('codeDialog'));
  expect(dialog).toBeInTheDocument();

  const textbox = within(dialog).getByRole('textbox');
  textbox.focus();
  await userEvent.keyboard(code);

  // confirm the addition
  const dialogButtons = dialog.querySelectorAll('button');
  await userEvent.click(dialogButtons[1]);
  return dialog;
};
