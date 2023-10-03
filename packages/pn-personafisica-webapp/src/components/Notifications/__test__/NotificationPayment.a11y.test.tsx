import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';

import {
  AppResponseMessage,
  PaymentInfoDetail,
  PaymentStatus,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { NOTIFICATION_PAYMENT_INFO } from '../../../api/notifications/notifications.routes';
import NotificationPayment from '../NotificationPayment';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string; components: Array<React.ReactNode> }) => (
    <>
      {props.i18nKey} {props.components.map((c) => c)}
    </>
  ),
}));

const payment = notificationToFe.recipients[2].payment;

describe('NotificationPayment component - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('does not have basic accessibility issues (required status)', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.REQUIRED,
        url: '',
      });
    await act(async () => {
      result = render(
        <NotificationPayment
          iun={notificationToFe.iun}
          notificationPayment={payment!}
          senderDenomination={notificationToFe.senderDenomination}
          subject={notificationToFe.subject}
        />
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (succeded status)', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.SUCCEEDED,
        url: '',
      });
    await act(async () => {
      result = render(
        <NotificationPayment
          iun={notificationToFe.iun}
          notificationPayment={payment!}
          senderDenomination={notificationToFe.senderDenomination}
          subject={notificationToFe.subject}
        />
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (in progress status)', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.INPROGRESS,
        url: '',
      });
    await act(async () => {
      result = render(
        <NotificationPayment
          iun={notificationToFe.iun}
          notificationPayment={payment!}
          senderDenomination={notificationToFe.senderDenomination}
          subject={notificationToFe.subject}
        />
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (in failed known status)', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
        detail_v2: 'PPT_STAZIONE_INT_PA_ERRORE_RESPONSE',
        errorCode: 'CODICE_ERRORE',
        url: '',
      });
    await act(async () => {
      result = render(
        <NotificationPayment
          iun={notificationToFe.iun}
          notificationPayment={payment!}
          senderDenomination={notificationToFe.senderDenomination}
          subject={notificationToFe.subject}
        />
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues (in failed unknown status)', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.GENERIC_ERROR,
        url: '',
      });
    await act(async () => {
      result = render(
        <NotificationPayment
          iun={notificationToFe.iun}
          notificationPayment={payment!}
          senderDenomination={notificationToFe.senderDenomination}
          subject={notificationToFe.subject}
        />
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('API error', async () => {
    mock.onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)).reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationPayment
            iun={notificationToFe.iun}
            notificationPayment={payment!}
            senderDenomination={notificationToFe.senderDenomination}
            subject={notificationToFe.subject}
          />
        </>
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
