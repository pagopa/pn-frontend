import React from "react";
import { waitFor } from "@testing-library/react";
import * as redux from 'react-redux';

import { render } from "../../test-utils";
import { IAppMessage } from "../../types";
import AppMessage from "../AppMessage";

const errors: Array<IAppMessage> = [
  {
    id: 'mocked-id',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    toNotify: true,
    alreadyShown: false,
  }
];

const reduxInitialState = {
  appState: {
    messages: {
      errors,
      success: []
    }
  },
};

describe('AppMessage Component', () => {

  it('renders toast and dispacthes event on close', async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    // render(<AppMessage />);
    render(<AppMessage/>, { preloadedState: reduxInitialState });
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: errors[0].id,
        type: 'appState/setErrorAsAlreadyShown',
      });
    }, {
      timeout: 5000
    });
    jest.resetAllMocks();
  }, 10000);
});