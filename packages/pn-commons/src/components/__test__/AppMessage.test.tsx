import React from 'react';
import * as redux from 'react-redux';

import { waitFor } from '@testing-library/react';

import { render } from '../../test-utils';
import { IAppMessage } from '../../types';
import AppMessage from '../AppMessage';

const errors: Array<IAppMessage> = [
  {
    id: 'mocked-id',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    toNotify: true,
    alreadyShown: false,
  },
];

const reduxInitialState = {
  appState: {
    messages: {
      errors,
      success: [],
    },
  },
};

describe('AppMessage Component', () => {
  it('renders toast and dispacthes event on close', async () => {
    const { testStore } = render(<AppMessage />, { preloadedState: reduxInitialState });
    await waitFor(
      () => {
        expect(testStore.getState().appState.messages.errors).toStrictEqual(errors);
      },
      {
        timeout: 5000,
      }
    );
    jest.resetAllMocks();
  }, 10000);
});
