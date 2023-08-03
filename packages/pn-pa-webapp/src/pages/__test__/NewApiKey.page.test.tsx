import MockAdapter from 'axios-mock-adapter';

import {
    act, fireEvent, mockApi, render, RenderResult, testFormElements, testInput
} from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CREATE_APIKEY } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import { GroupStatus } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import NewApiKey from '../NewApiKey.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockGroups = [
  { id: '1', name: 'mock-Group1', description: '', status: 'ACTIVE' },
  { id: '2', name: 'mock-Group2', description: '', status: 'ACTIVE' },
];

describe('NewApiKey component', () => {
  let result: RenderResult;

  let mock: MockAdapter;

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  it('render NewApiKey', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      GET_USER_GROUPS(GroupStatus.ACTIVE),
      200,
      undefined,
      mockGroups
    );
    await act(async () => {
      result = render(<NewApiKey />);
    });
    expect(result?.container).toHaveTextContent(/page-title/i);
    const form = result?.container.querySelector('form');
    testFormElements(form!, 'name', 'form-placeholder-name');
    testFormElements(form!, 'groups', 'form-placeholder-groups', true);
    const button = form?.querySelector('button[type="submit"]');
    expect(button!).toBeDisabled();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/ext-registry/pa/v1/groups?statusFilter=ACTIVE');
  });

  it('changes form values and clicks on confirm', async () => {
    const mockRequest = {
      name: 'mock-name',
      groups: [],
    };
    mock = mockApi(
      apiClient,
      'GET',
      GET_USER_GROUPS(GroupStatus.ACTIVE),
      200,
      undefined,
      mockGroups
    );
    mockApi(
      mock,
      'POST',
      CREATE_APIKEY(),
      200,
      mockRequest,
      'mocked-api-key-result'
    );
    await act(async () => {
      result = render(<NewApiKey />);
    });
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'name', mockRequest.name);
    const button = form.querySelector('button[type="submit"]');
    expect(button).toBeEnabled();
    await act(async () => {
      fireEvent.click(button!);
    });
    expect(result?.container).toHaveTextContent(/api-key-succesfully-generated/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/ext-registry/pa/v1/groups?statusFilter=ACTIVE');
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toContain('/api-key-self/api-keys/');
  });

  test('clicks on the breadcrumb button', async () => {
    await act(async () => {
      result = render(<NewApiKey />);
    });
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/title/i);
    expect(links![0]).toHaveAttribute('href', routes.API_KEYS);
  });
});
