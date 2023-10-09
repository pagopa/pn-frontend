import React from 'react';

import { render } from '@testing-library/react';

import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { F24PaymentDetails, PaymentAttachmentSName } from '../../../types';
import NotificationPaymentF24Item from '../NotificationPaymentF24Item';

describe('NotificationPaymentF24Item Component', () => {
  const f24Item = payments.find((item) => !item.pagoPA && item.f24)?.f24 as F24PaymentDetails;
  const TIMERF24 = 15000;

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

  it('should call function handleDownloadAttachment when click on download button', () => {
    const getPaymentAttachmentActionMk = jest
      .fn()
      .mockImplementation(() => ({ unwrap: () => new Promise(() => void 0), abort: jest.fn() }));

    const item = { ...f24Item, attachmentIdx: 1 };
    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        timerF24={TIMERF24}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
      />
    );
    const downloadButton = result.getByTestId('download-f24-button');

    downloadButton.click();

    expect(getPaymentAttachmentActionMk).toHaveBeenCalledTimes(1);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      item.attachmentIdx
    );
  });
});
