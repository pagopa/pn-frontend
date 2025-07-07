import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { getById, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { ZENDESK_AUTHORIZATION } from '../../api/support/support.routes';
import * as routes from '../../navigation/routes.const';
import SupportPage from '../Support.page';

describe('Support page', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const originalSubmit = HTMLFormElement.prototype.submit;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(HTMLFormElement.prototype, 'submit', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(HTMLFormElement.prototype, 'submit', {
      configurable: true,
      value: originalSubmit,
    });
  });

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
    const confirmExitBtn = within(promptDialog).getByTestId('confirmExitBtn');
    fireEvent.click(confirmExitBtn);

    // after clicking button - mocked dashboard present
    await waitFor(() => {
      const mockedPageAfter = result.queryByTestId('mocked-dashboard');
      expect(mockedPageAfter).toBeInTheDocument();
    });
  });

  it('submit form - no "data" param', async () => {
    const mail = 'mail@example.it';
    const response = {
      action: 'https://zendesk-url.com',
      jwt: 'zendesk-jwt',
      return_to: 'https://suuport-url.com',
    };

    mock.onPost(ZENDESK_AUTHORIZATION(), { email: mail }).reply(200, response);

    const { getByTestId } = render(<SupportPage />);
    const form = getByTestId('supportForm');
    testInput(form, 'mail', mail);
    testInput(form, 'confirmMail', mail);
    const continueButton = getByTestId('continueButton');
    expect(continueButton).toBeEnabled();
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(ZENDESK_AUTHORIZATION());
    });
  });

  it('submit with valid "data" param', async () => {
    const mockResponse = {
      action_url: 'https://zendesk.com/submit',
      jwt: 'mock-jwt-token',
      return_to: 'https://app.return',
    };

    const traceId = 'abc123';
    const errorCode = 'ERR42';
    const encodedData = encodeURIComponent(JSON.stringify({ traceId, errorCode }));

    mock.onPost(ZENDESK_AUTHORIZATION()).reply((config) => {
      const body = JSON.parse(config.data);
      expect(body.email).toBe('mail@example.it');
      expect(body.data).toEqual({ traceId, errorCode });
      return [200, mockResponse];
    });

    const history = createBrowserHistory();
    history.push(`/support?data=${encodedData}`);

    const { getByTestId } = render(
      <Routes>
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    );

    const form = getByTestId('supportForm');
    testInput(form, 'mail', 'mail@example.it');
    testInput(form, 'confirmMail', 'mail@example.it');

    const continueButton = getByTestId('continueButton');

    fireEvent.click(continueButton);

    // wait for side effect (ZendeskForm gets data)
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });
  });
});
