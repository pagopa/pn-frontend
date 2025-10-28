import { vi } from 'vitest';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { payments } from '../../../__mocks__/NotificationDetail.mock';
import {
  F24PaymentDetails,
  PaymentAttachment,
  PaymentAttachmentSName,
} from '../../../models/NotificationDetail';
import { act, createTestStore, fireEvent, render, waitFor } from '../../../test-utils';
import NotificationPaymentF24Item from '../NotificationPaymentF24Item';

let counter = 0;
const downloadUrl = 'https://www.mocked-url.com';
const retryAfterDelay = 2000;
const getSentNotificationPayment = createAsyncThunk<
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
  const store = createTestStore();

  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  beforeEach(() => {
    window.location.href = '';
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  const getPaymentAttachmentActionMk = (
    downloadStatus: 'immediatly' | 'ready' | 'not-ready' | 'error',
    name: PaymentAttachmentSName,
    attachmentIdx?: number | undefined
  ) => store.dispatch(getSentNotificationPayment({ name, attachmentIdx, downloadStatus }));

  it('renders component - should show title and included cost label of f24Item', () => {
    const item = { ...f24Item, applyCost: true };
    const { container, getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={vi.fn()}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    expect(container).toHaveTextContent(item.title);
    expect(container).toHaveTextContent('included-costs');
    const downloadBtn = getByTestId('download-f24-button');
    expect(downloadBtn).toBeInTheDocument();
  });

  it('renders component - should show label if costs are included', () => {
    const item = { ...f24Item, applyCost: true };
    const { container } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={vi.fn()}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    expect(container).toHaveTextContent('included-costs');
  });

  it('should show the correct label if is a PagoPA attachment', () => {
    const item = { ...f24Item, applyCost: true };
    const { container, getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={vi.fn()}
        isPagoPaAttachment
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    expect(container).toHaveTextContent('detail.payment.download-f24');
    const downloadBtn = getByTestId('download-f24-button');
    expect(downloadBtn).toBeInTheDocument();
  });

  it('should call function handleDownloadAttachment when click on download button', () => {
    const getPaymentAttachmentActionMk = vi.fn();
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
        disableDownload={false}
        handleDownload={() => {}}
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

  it('immediatly download the attachment', async () => {
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={(
          name: PaymentAttachmentSName,
          attachmentIdx?: number | undefined
        ) => getPaymentAttachmentActionMk('immediatly', name, attachmentIdx)}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    const downloadButton = getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // if the api immediatly returns the url, we dowload the file
    const downloadingMessage = getByTestId('f24-download-message');
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    await waitFor(() => {
      expect(downloadingMessage).not.toBeInTheDocument();
    });
    expect(window.location.href).toBe(downloadUrl);
  });

  it('download the attachment after retryAfter', async () => {
    vi.useFakeTimers();
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={(
          name: PaymentAttachmentSName,
          attachmentIdx?: number | undefined
        ) => getPaymentAttachmentActionMk('ready', name, attachmentIdx)}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    const downloadButton = getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // show downloading message and after recall the api to download the file
    const downloadingMessage = getByTestId('f24-download-message');
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    // wait...
    await act(() => vi.advanceTimersToNextTimerAsync());
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-waiting');
    // wait...
    await act(() => vi.advanceTimersToNextTimerAsync());
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-ongoing');
    // download the file
    await act(() => vi.advanceTimersByTime(1000));
    await vi.waitFor(() => {
      expect(downloadingMessage).not.toBeInTheDocument();
    });
    expect(window.location.href).toBe(downloadUrl);
    vi.useRealTimers();
  });

  it('should show error when interval is finished', async () => {
    vi.useFakeTimers();
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={(
          name: PaymentAttachmentSName,
          attachmentIdx?: number | undefined
        ) => getPaymentAttachmentActionMk('not-ready', name, attachmentIdx)}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    const downloadButton = getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    // show downloading message and after recall the api to download the file
    const downloadingMessage = await vi.waitFor(() => getByTestId('f24-download-message'));
    expect(downloadingMessage).toBeInTheDocument();
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-in-progress');
    // wait...
    await act(() => vi.advanceTimersToNextTimerAsync());
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-waiting');
    // wait...
    await act(() => vi.advanceTimersToNextTimerAsync());
    expect(downloadingMessage).toHaveTextContent('detail.payment.download-f24-ongoing');
    // show the error
    await act(() => vi.advanceTimersByTimeAsync(1000));
    const error = await vi.waitFor(() => getByTestId('f24-maxTime-error'));
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('detail.payment.f24-download-error');
    vi.useRealTimers();
  });

  it('should show error when api goes in error', async () => {
    const item = { ...f24Item, attachmentIdx: 1 };
    const { getByTestId } = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={(
          name: PaymentAttachmentSName,
          attachmentIdx?: number | undefined
        ) => getPaymentAttachmentActionMk('error', name, attachmentIdx)}
        disableDownload={false}
        handleDownload={() => {}}
      />
    );
    const downloadButton = getByTestId('download-f24-button');
    fireEvent.click(downloadButton);
    const error = await waitFor(() => getByTestId('f24-maxTime-error'));
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('detail.payment.f24-download-error');
  });
});
