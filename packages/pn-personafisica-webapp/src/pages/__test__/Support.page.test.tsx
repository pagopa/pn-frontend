import { createBrowserHistory } from 'history';
import { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { getById, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import * as routes from '../../navigation/routes.const';
import SupportPage from '../Support.page';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components!.map((c) => c)}
    </>
  ),
}));

describe('Support page', async () => {
  let result: RenderResult;

  it('render page', () => {
    const { container, getByTestId } = render(<SupportPage />);
    expect(container).toHaveTextContent(/title/);
    expect(container).toHaveTextContent(/sub-title/);
    const form = getByTestId('supportForm');
    expect(form).toBeInTheDocument();
    const email = getById(form, 'mail');
    expect(email).toBeInTheDocument();
    expect(email).toHaveValue('');
    const confirmEmail = getById(form, 'confirmMail');
    expect(confirmEmail).toBeInTheDocument();
    expect(confirmEmail).toHaveValue('');
    const backButton = getByTestId('backButton');
    expect(backButton).toBeInTheDocument();
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });

  it('fill values - OK', () => {
    const { getByTestId } = render(<SupportPage />);
    const form = getByTestId('supportForm');
    testInput(form, 'mail', 'mail@example.it');
    testInput(form, 'confirmMail', 'mail@example.it');
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeEnabled();
  });

  it('fill values - KO - emails not the same', () => {
    const { getByTestId } = render(<SupportPage />);
    const form = getByTestId('supportForm');
    testInput(form, 'mail', 'mail@example.it');
    testInput(form, 'confirmMail', 'mail-divergent@example.it');
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeDisabled();
    const helperText = getById(form, 'confirmMail-helper-text');
    expect(helperText).toHaveTextContent('form.errors.not-the-same');
  });

  it('fill values - KO - invalid emails', () => {
    const { getByTestId } = render(<SupportPage />);
    const form = getByTestId('supportForm');
    testInput(form, 'mail', 'mail-wrong.it');
    testInput(form, 'confirmMail', 'mail-wrong.it');
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeDisabled();
    const helperTextMail = getById(form, 'mail-helper-text');
    expect(helperTextMail).toHaveTextContent('form.errors.not-valid');
    const helperTextConfirmMail = getById(form, 'confirmMail-helper-text');
    expect(helperTextConfirmMail).toHaveTextContent('form.errors.not-valid');
  });

  it('click back button and show prompt', async () => {
    // insert two entries into the history, so the initial render will refer to the path /assistenza
    // and when the back button is pressed and so navigate(-1) is invoked,
    // the path will change to /notifiche
    const history = createBrowserHistory();
    history.push(routes.NOTIFICHE);
    history.push(routes.SUPPORT);

    // render with an ad-hoc router, will render initially SupportPage
    // since it corresponds to the top of the mocked history stack
    await act(async () => {
      result = render(
        <Routes>
          <Route
            path={routes.NOTIFICHE}
            element={<div data-testid="mocked-dashboard">hello</div>}
          />
          <Route path={routes.SUPPORT} element={<SupportPage />} />
        </Routes>
      );
    });

    // before clicking the button - mocked dashboard not present
    const mockedPageBefore = result.queryByTestId('mocked-dashboard');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate clicking the button
    const backButton = result.getByTestId('backButton');
    fireEvent.click(backButton);

    // prompt must be shown
    const promptDialog = await waitFor(() => result.getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog!).getByTestId('confirmExitBtn');
    fireEvent.click(confirmExitBtn);

    // after clicking button - mocked dashboard present
    await waitFor(() => {
      const mockedPageAfter = result.queryByTestId('mocked-dashboard');
      expect(mockedPageAfter).toBeInTheDocument();
    });
  });
});
