/* eslint-disable functional/no-let */
import * as redux from 'react-redux';
import { render, act, RenderResult, testFormElements, testInput, fireEvent, waitFor } from '../../__test__/test-utils';
import * as hooks from '../../redux/hooks';

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
  const confirmHandlerMk = jest.fn();

  beforeEach(async () =>{
    const useAppSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
    useAppSelectorSpy.mockReturnValue({
      groups: [
        { id: '1', name: 'mock-Group1', description: '', status: 'ACTIVE' },
        { id: '2', name: 'mock-Group2', description: '', status: 'ACTIVE' },
      ],
      apiKey: ''
    });
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);

    // render component
    await act(async () => {
      result = render(
        <NewApiKey />
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
    const form = result.container.querySelector('form');
    await testInput(form!, 'name', 'mock-name');
    const button = form?.querySelector('button[type="submit"]');
    expect(button).toBeEnabled();
    // await waitFor(() => fireEvent.click(button!));
    await waitFor(() => form?.submit());
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      /* expect(mockDispatchFn).toBeCalledWith({
        payload: {
          name: 'mock-name',
          groups: [],
        },
        type: 'newApiKeyState/saveNewApiKey',
      }); */
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });

});