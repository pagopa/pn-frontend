/* eslint-disable functional/no-let */
import * as redux from 'react-redux';

import { render, act, RenderResult, testFormElements, testInput, fireEvent, waitFor } from '../../__test__/test-utils';
import * as routes from '../../navigation/routes.const';
import NewApiKey from '../NewApiKey.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NewApiKey component', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;

  beforeEach(async () =>{
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    // render component
    await act(async () => {
      result = render(
        <NewApiKey />, {preloadedState: {
          newApiKeyState: {
            groups: [
              { id: '1', name: 'mock-Group1', description: '', status: 'ACTIVE' },
              { id: '2', name: 'mock-Group2', description: '', status: 'ACTIVE' },
            ],
            apiKey: ''
          }
        }}
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('render NewApiKey', async () => {
    expect(result.container).toHaveTextContent(/page-title/i);
    const form = result.container.querySelector('form');
    testFormElements(form!, 'name', 'form-placeholder-name');
    testFormElements(form!, 'groups', 'form-placeholder-groups', true);
    const button = form?.querySelector('button[type="submit"]');
    expect(button!).toBeDisabled();
  });

  it('changes form values and clicks on confirm', async () => {
    // mock dispatch
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'name', 'mock-name');
    const button = form.querySelector('button[type="submit"]');
    expect(button).toBeEnabled();
    fireEvent.click(button!);

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
    });
  });

  test('clicks on the breadcrumb button', async () => {
    const links = result?.getAllByRole('link');
    expect(links![0]).toHaveTextContent(/page-title/i);
    expect(links![0]).toHaveAttribute('href', routes.API_KEYS);
  });

});