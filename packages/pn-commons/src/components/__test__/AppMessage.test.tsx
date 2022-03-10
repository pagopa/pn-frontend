import { act, waitFor } from "@testing-library/react";
import * as redux from 'react-redux';

import { render } from "../../test-utils";
import { AppError } from "../../types/AppError";
import AppMessage from "../AppMessage";

const errors: Array<AppError> = [
  {
    id: 'mocked-id',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    toNotify: true
  }
]

describe('AppMessage Component', () => {

  it('renders toast and dispacthes event on close', async () => {
    // mock useSelector
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy.mockReturnValue(errors);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    await act(async () => {
      render(<AppMessage />);
    });
    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: errors[0].id,
        type: 'appState/removeError',
      });
    }, {
      timeout: 2500
    });
    jest.resetAllMocks();
  });
});