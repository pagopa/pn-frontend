import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  testAutocomplete,
  testFormElements,
  testInput,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { mockGroups, newApiKeyDTO, newApiKeyResponse } from '../../__mocks__/ApiKeys.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import NewApiKey from '../NewApiKey.page';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NewApiKey component', async () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render NewApiKey', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, mockGroups);
    await act(async () => {
      result = render(<NewApiKey />);
    });
    expect(result.container).toHaveTextContent(/page-title/i);
    const form = result.getByTestId('new-api-key-form');
    testFormElements(form, 'name', 'form-placeholder-name');
    testFormElements(form, 'groups', 'form-placeholder-groups');
    const submitButton = within(form).getByTestId('submit-new-api-key');
    expect(submitButton).toBeDisabled();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/pa/groups?status=ACTIVE');
  });

  it('empty and invalid form', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, mockGroups);
    await act(async () => {
      result = render(<NewApiKey />);
    });
    const form = result.getByTestId('new-api-key-form');

    // initial status: empty form, submit is disabled, no error message
    const submitButton = within(form).getByTestId('submit-new-api-key');
    expect(submitButton).toBeDisabled();
    expect(result.container).not.toHaveTextContent(/form-error-name/);

    // fill api key name: valid form, submit is enabled, no error message
    await testInput(form, 'name', newApiKeyDTO.name);
    expect(submitButton).toBeEnabled();
    expect(result.container).not.toHaveTextContent(/form-error-name/);

    // fill api key name with only spaces: invalid form, submit is disabled, error message shown
    await testInput(form, 'name', '   ');
    expect(submitButton).toBeDisabled();
    expect(result.container).toHaveTextContent(/no-spaces-at-edges/);

    // set back api key name to empty text field, submit is disabled, error message shown
    await testInput(form, 'name', '');
    expect(submitButton).toBeDisabled();
    expect(result.container).toHaveTextContent(/form-error-name/);
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet('/bff/v1/pa/groups?status=ACTIVE').reply(200, mockGroups);
    mock.onPost('/bff/v1/api-keys', newApiKeyDTO).reply(200, newApiKeyResponse);

    await act(async () => {
      result = render(<NewApiKey />);
    });
    const form = result.getByTestId('new-api-key-form');
    await testInput(form, 'name', newApiKeyDTO.name);
    await testAutocomplete(
      form,
      'groups',
      mockGroups.map((g) => ({ id: g.id, name: g.name })),
      true,
      0
    );
    const submitButton = within(form).getByTestId('submit-new-api-key');
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(result.container).toHaveTextContent(/api-key-succesfully-generated/);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/pa/groups?status=ACTIVE');
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toContain('/bff/v1/api-keys');
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(newApiKeyDTO);
  });

  it('clicks on the breadcrumb button', async () => {
    // simulate the current URL
    const history = createBrowserHistory();
    history.push(routes.NUOVA_API_KEY);

    // render using an ad-hoc router
    await act(async () => {
      result = render(
        <Routes>
          <Route path={routes.NUOVA_API_KEY} element={<NewApiKey />} />
          <Route
            path={routes.API_KEYS}
            element={<div data-testid="mock-api-keys-page">hello</div>}
          />
        </Routes>
      );
    });
    // the mocked ApiKeys page does not appear before we click the corresponding link
    const mockApiKeysPageBefore = result.queryByTestId('mock-api-keys-page');
    expect(mockApiKeysPageBefore).not.toBeInTheDocument();

    // simulate click on the breadcrumb link ...
    const links = result.getAllByRole('link');
    expect(links[0]).toHaveTextContent(/title/i);
    expect(links[0]).toHaveAttribute('href', routes.API_KEYS);
    fireEvent.click(links[0]);

    // ... hence prompt must be shown
    const promptDialog = await waitFor(() => result.getByTestId('promptDialog'));
    expect(promptDialog).toBeInTheDocument();
    const confirmExitBtn = within(promptDialog).getByTestId('confirmExitBtn');
    expect(confirmExitBtn).toBeInTheDocument();
    fireEvent.click(confirmExitBtn);

    // after clicking the "confirm" button in the prompt, the mocked ApiKeys page should be rendered
    await waitFor(() => {
      const mockApiKeysPageAfter = result.queryByTestId('mock-api-keys-page');
      expect(mockApiKeysPageAfter).toBeInTheDocument();
    });
  });
});
