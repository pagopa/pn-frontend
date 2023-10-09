import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { appStateReducer } from '../../../redux';
import { F24PaymentDetails, PaymentAttachment, PaymentAttachmentSName } from '../../../types';
import NotificationPaymentF24Item from '../NotificationPaymentF24Item';

function createTestStore() {
  return configureStore({
    reducer: { appState: appStateReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

let mockedActionResult;
const getPaymentAttachment = createAsyncThunk<
  PaymentAttachment,
  { name: PaymentAttachmentSName; attachmentIdx?: number }
>('mockedAction', async (_, { rejectWithValue }) => {
  try {
    if (mockedActionResult) {
      return await Promise.resolve(mockedActionResult);
    }
    return await Promise.reject('action-failed');
  } catch (e) {
    return rejectWithValue(e);
  }
});

describe('NotificationPaymentF24Item Component', () => {
  const f24Item = payments.find((item) => !item.pagoPA && item.f24)?.f24 as F24PaymentDetails;
  const TIMERF24 = 5000;

  let store;
  beforeAll(() => {
    store = createTestStore();
  });

  const getPaymentAttachmentActionMk = (
    name: PaymentAttachmentSName,
    attachmentIdx?: number | undefined
  ) => store.dispatch(getPaymentAttachment({ name, attachmentIdx }));

  it('renders component - should show title of f24Item', () => {
    const item = { ...f24Item, title: 'F24 Rata' };
    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={jest.fn()}
      />
    );

    expect(result.container).toHaveTextContent(item.title);
  });

  it('should show the correct label if is a PagoPA attachment', () => {
    const item = { ...f24Item, title: 'F24 Rata' };
    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={jest.fn()}
        isPagoPaAttachment
      />
    );

    expect(result.container).toHaveTextContent('detail.payment.download-f24');
  });

  it.skip('should call function handleDownloadAttachment when click on download button', async () => {
    let result;
    mockedActionResult = {
      url: 'https://www.mocked-url.com',
    };
    const item = { ...f24Item, attachmentIdx: 1 };

    act(() => {
      result = render(
        <NotificationPaymentF24Item
          f24Item={item}
          timerF24={TIMERF24}
          getPaymentAttachmentAction={getPaymentAttachmentActionMk}
        />
      );
    });

    const downloadButton = result.getByTestId('download-f24-button');
    await act(async () => {
      downloadButton.click();
    });

    expect(getPaymentAttachmentActionMk).toHaveBeenCalledTimes(1);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      item.attachmentIdx
    );
  });

  it('shoudl show error when interval is finished', () => {
    jest.useFakeTimers();

    const item = { ...f24Item, attachmentIdx: 1 };
    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={jest.fn()}
      />
    );

    const downloadButton = result.getByTestId('download-f24-button');
    downloadButton.click();

    jest.advanceTimersByTime(TIMERF24);

    const errorMessage = result.getByTestId('f24-maxTime-error');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should check that message change on interval when click download', async () => {
    jest.useFakeTimers();
    const retryAfter = 4000;

    mockedActionResult = { retryAfter };

    const item = { ...f24Item, attachmentIdx: 1 };

    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
      />
    );

    const downloadButton = result.getByTestId('download-f24-button');
    await waitFor(() => {
      fireEvent.click(downloadButton);
    });

    const message = result.getByTestId('f24-download-message');
    expect(message).toHaveTextContent('detail.payment.download-f24-in-progress');

    const timeout = Math.min(retryAfter, TIMERF24);

    jest.advanceTimersByTime((timeout - 1000) / 2);
    expect(message).toHaveTextContent('detail.payment.download-f24-waiting');

    jest.advanceTimersByTime((timeout - 1000) / 2);
    expect(message).toHaveTextContent('detail.payment.download-f24-ongoing');
  });
});
