import * as redux from 'react-redux';
import { NotificationDetailPayment } from "@pagopa-pn/pn-commons";

export const mockedNotificationDetailPayment = {
  notificationFeePolicy: 'FLAT_RATE',
  noticeCode: 'mocked-noticeCode',
  creditorTaxId: "mocked-creditorTaxId",
  pagoPaForm: {
    digests: {
      sha256: "mocked-pagopa-sha256"
    },
    contentType: "application/pdf",
    ref: {
      key: "mocked-pagopa-key",
      versionToken: "mockedVersionToken"
    }
  },
  f24flatRate: {
    digests: {
      sha256: "mocked-f24-sha256"
    },
    contentType: "application/pdf",
    ref: {
      key: "mocked-f24-key",
      versionToken: "mockedVersionToken"
    }
  }
} as NotificationDetailPayment;

export function doMockUseDispatch(): any {
  const mockDispatchFn = jest.fn(() => ({
    unwrap: () => Promise.resolve(),
  }));

  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  return mockDispatchFn;
}
