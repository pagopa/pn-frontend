import React from 'react';

import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';

import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { F24PaymentDetails, PaymentAttachment, PaymentAttachmentSName } from '../../../models';
import { appStateReducer } from '../../../redux';
import { act, fireEvent, render, waitFor } from '../../../test-utils';
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

let counter = 0;
const downloadUrl = 'https://www.mocked-url.com';
const retryAfterDelay = 2000;
const getPaymentAttachment = createAsyncThunk<
  PaymentAttachment,
  {
    name: PaymentAttachmentSName;
    attachmentIdx?: number;
    downloadStatus: 'immediatly' | 'ready' | 'not-ready' | 'error';
  }
>('mockedAction', async (params, { rejectWithValue }) => {
  try {
    const response = {
      filename: 'Name',
      url: '',
      contenType: 'application/pdf',
      contentLength: 2000,
      sha256: 'mocked-sha256',
    };
    if (params.downloadStatus === 'immediatly') {
      return await new Promise((resolve) =>
        setTimeout(() => resolve({ ...response, url: downloadUrl }), 200)
      );
    }
    if (
      (params.downloadStatus === 'ready' && counter === 0) ||
      params.downloadStatus === 'not-ready'
    ) {
      counter++;
      return await Promise.resolve({ ...response, retryAfter: retryAfterDelay });
    }
    if (params.downloadStatus === 'error') {
      throw new Error('failing action');
    }
    counter = 0;
    return await Promise.resolve({ ...response, url: downloadUrl });
  } catch (e) {
    return rejectWithValue(e);
  }
});

describe('NotificationPaymentF24Item Component', () => {
  const f24Item = payments.find((item) => !item.pagoPa && item.f24)?.f24 as F24PaymentDetails;
  const TIMERF24 = 5000;
  let store;

  const original = window.location;

  beforeAll(() => {
    store = createTestStore();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
    jest.useFakeTimers();
  });

  beforeEach(() => {
    window.location.href = '';
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
    jest.useRealTimers();
  });

  const getPaymentAttachmentActionMk = (
    downloadStatus: 'immediatly' | 'ready' | 'not-ready' | 'error',
    name: PaymentAttachmentSName,
    attachmentIdx?: number | undefined
  ) => store.dispatch(getPaymentAttachment({ name, attachmentIdx, downloadStatus }));

  it('renders component - should show title of f24Item', () => {
    const item = { ...f24Item, applyCost: true };
    const { container, getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={jest.fn()}
      />
    );
    expect(container).toHaveTextContent(item.title);
    const downloadBtn = getByTestId('download-f24-button');
    expect(downloadBtn).toBeInTheDocument();
    // applyCost caption
    const caption = getByTestId('f24-apply-costs-caption');
    expect(caption).toBeInTheDocument();
  });

  it('should show the correct label if is a PagoPA attachment', () => {
    const item = { ...f24Item, applyCost: true };
    const { container, getByTestId, queryByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={jest.fn()}
        isPagoPaAttachment
      />
    );
    expect(container).toHaveTextContent('detail.payment.download-f24');
    const downloadBtn = getByTestId('download-f24-button');
    expect(downloadBtn).toBeInTheDocument();
    // if payment is an attachment, the applyCost caption must be not shown
    const caption = queryByTestId('f24-apply-costs-caption');
    expect(caption).not.toBeInTheDocument();
  });

  it('should call function handleDownloadAttachment when click on download button', () => {
    const getPaymentAttachmentActionMk = jest.fn();
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
      />
    );
    const downloadButton = getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledTimes(1);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      item.attachmentIdx
    );
  });

  it('immediatly dowload the attachment', async () => {
    let result;
    const item = { ...f24Item, attachmentIdx: 1 };
    act(() => {
      result = render(
        <NotificationPaymentF24Item
          f24Item={item}
          timerF24={TIMERF24}
          getPaymentAttachmentAction={(
            name: PaymentAttachmentSName,
            attachmentIdx?: number | undefined
          ) => getPaymentAttachmentActionMk('immediatly', name, attachmentIdx)}
        />
      );
    });
    const downloadButton = result.getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // if the api immediatly returns the url, we dowload the file
    const downloadingMessage = await waitFor(() => result.getByTestId('f24-download-message'));
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    jest.runAllTimers();
    await waitFor(() => {
      expect(downloadingMessage).not.toBeInTheDocument();
    });
    expect(window.location.href).toBe(downloadUrl);
  });

  // TO-FIX: il test fallisce perchè sembra che in jest 27, useFakeTimers non funzioni correttamente
  it.skip('download the attachment after retryAfter', async () => {
    let result;
    const item = { ...f24Item, attachmentIdx: 1 };
    act(() => {
      result = render(
        <NotificationPaymentF24Item
          f24Item={item}
          timerF24={TIMERF24}
          getPaymentAttachmentAction={(
            name: PaymentAttachmentSName,
            attachmentIdx?: number | undefined
          ) => getPaymentAttachmentActionMk('ready', name, attachmentIdx)}
        />
      );
    });
    const downloadButton = result.getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // show downloading message and after recall the api to download the file
    const downloadingMessage = await waitFor(() => result.getByTestId('f24-download-message'));
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    // wait...
    act(() => {
      jest.advanceTimersByTime((retryAfterDelay - 1000) / 2);
    });
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-waiting');
    // wait...
    act(() => {
      jest.advanceTimersByTime((retryAfterDelay - 1000) / 2);
    });
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-ongoing');
    // download the file
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(downloadingMessage).not.toBeInTheDocument();
    });
    expect(window.location.href).toBe(downloadUrl);
  });

  // TO-FIX: il test fallisce perchè sembra che in jest 27, useFakeTimers non funzioni correttamente
  it.skip('should show error when interval is finished', async () => {
    let result;
    const item = { ...f24Item, attachmentIdx: 1 };
    act(() => {
      result = render(
        <NotificationPaymentF24Item
          f24Item={item}
          timerF24={TIMERF24}
          getPaymentAttachmentAction={(
            name: PaymentAttachmentSName,
            attachmentIdx?: number | undefined
          ) => getPaymentAttachmentActionMk('not-ready', name, attachmentIdx)}
        />
      );
    });
    const downloadButton = result.getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // show downloading message and after recall the api to download the file
    const downloadingMessage = await waitFor(() => result.getByTestId('f24-download-message'));
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    // wait...
    act(() => {
      jest.advanceTimersByTime((retryAfterDelay - 1000) / 2);
    });
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-waiting');
    // wait...
    act(() => {
      jest.advanceTimersByTime((retryAfterDelay - 1000) / 2);
    });
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-ongoing');
    // show the error
    jest.advanceTimersByTime(1000);
    const error = await waitFor(() => result.getByTestId('f24-maxTime-error'));
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('detail.payment.f24-download-error');
  });

  it('should show error when api goes in error', async () => {
    let result;
    const item = { ...f24Item, attachmentIdx: 1 };
    act(() => {
      result = render(
        <NotificationPaymentF24Item
          f24Item={item}
          timerF24={TIMERF24}
          getPaymentAttachmentAction={(
            name: PaymentAttachmentSName,
            attachmentIdx?: number | undefined
          ) => getPaymentAttachmentActionMk('error', name, attachmentIdx)}
        />
      );
    });
    const downloadButton = result.getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    const error = await waitFor(() => result.getByTestId('f24-maxTime-error'));
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('detail.payment.f24-download-error');
  });
});
