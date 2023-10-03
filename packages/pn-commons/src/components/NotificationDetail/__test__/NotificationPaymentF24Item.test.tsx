import { render } from '@testing-library/react';
import React from 'react';
import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { F24PaymentDetails, PaymentAttachmentSName } from '../../../types';
import NotificationPaymentF24Item from '../NotificationPaymentF24Item';

describe('NotificationPaymentF24Item Component', () => {
  const f24Item = payments.find((item) => !item.pagoPA && item.f24)?.f24 as F24PaymentDetails;

  it('renders NotificationPaymentPagoPAItem - should show title of f24Item', () => {
    const item = { ...f24Item, title: 'F24 Rata' };
    const result = render(
      <NotificationPaymentF24Item f24Item={item} handleDownloadAttachment={() => void 0} />
    );

    expect(result.container).toHaveTextContent(item.title);
  });

  it('should call function handleDownloadAttachment when click on download button', () => {
    const handleDownloadAttachment = jest.fn();
    const item = { ...f24Item, attachmentIdx: 1, recipientIdx: 1 };
    const result = render(
      <NotificationPaymentF24Item
        f24Item={item}
        handleDownloadAttachment={handleDownloadAttachment}
        isF24Ready
      />
    );
    const downloadButton = result.getByTestId('download-f24-button');

    downloadButton.click();

    expect(handleDownloadAttachment).toHaveBeenCalledTimes(1);
    expect(handleDownloadAttachment).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      item.recipientIdx,
      item.attachmentIdx
    );
  });
});
