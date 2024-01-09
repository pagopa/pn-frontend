import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  testAutocomplete,
  testFormElements,
  testInput,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { mockGroups } from '../../__mocks__/ApiKeys.mock';
import { newApiKeyDTO, newApiKeyResponse } from '../../__mocks__/NewApiKey.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { CREATE_APIKEY } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import { GroupStatus } from '../../models/user';
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
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render NewApiKey', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, mockGroups);

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
    expect(mock.history.get[0].url).toContain('/ext-registry/pa/v1/groups?statusFilter=ACTIVE');
  });

  it('empty and invalid form', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, mockGroups);
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

    // set back api key name to empty text field, submit is disabled, error message shown
    await testInput(form, 'name', '');
    expect(submitButton).toBeDisabled();
    expect(result.container).toHaveTextContent(/form-error-name/);
  });

  it('changes form values and clicks on confirm', async () => {
    mock.onGet(GET_USER_GROUPS(GroupStatus.ACTIVE)).reply(200, mockGroups);
    mock.onPost(CREATE_APIKEY(), newApiKeyDTO).reply(200, newApiKeyResponse);

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
    expect(mock.history.get[0].url).toContain('/ext-registry/pa/v1/groups?statusFilter=ACTIVE');
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toContain(CREATE_APIKEY());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual(newApiKeyDTO);
  });

  it('clicks on the breadcrumb button', async () => {
    // simulate the current URL
    window.history.pushState({}, '', '/new-api-key');

    // render using an ad-hoc router
    await act(async () => {
      result = render(
        <Routes>
          <Route path="/new-api-key" element={<NewApiKey />} />
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
