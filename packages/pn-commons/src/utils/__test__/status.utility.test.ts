import { NotificationStatus } from '../../types/NotificationStatus';
import { getNotificationStatusInfos } from '../status.utility';


function testStatusLabelAndColorFn(
  status: NotificationStatus,
  labelToTest: string,
  colorToTest: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary',
  tooltipToTest: string
) {
  const { label, color, tooltip } = getNotificationStatusInfos(status);
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  expect(tooltip).toBe(tooltipToTest);
}

test('return notification status, label and color - DELIVERED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.DELIVERED,
    'Consegnata',
    'default',
    'La notifica è stata consegnata'
  );
});

test('return notification status, label and color - DELIVERING', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.DELIVERING,
    'Invio in corso',
    'default',
    "L'invio della notifica è in corso"
  );
});

test('return notification status, label and color - UNREACHABLE', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.UNREACHABLE,
    'Destinatario irreperibile',
    'error',
    'Il destinatario non è reperibile'
  );
});

test('return notification status, label and color - PAID', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.PAID,
    'Pagata',
    'success',
    'Il destinatario ha pagato i costi della notifica'
  );
});

test('return notification status, label and color - ACCEPTED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.ACCEPTED,
    'Depositata',
    'default',
    "L'ente ha depositato la notifica"
  );
});

test('return notification status, label and color - EFFECTIVE_DATE', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.EFFECTIVE_DATE,
    'Perfezionata per decorrenza termini',
    'info',
    'Il destinatario non ha letto la notifica'
  );
});

test('return notification status, label and color - VIEWED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.VIEWED,
    'Perfezionata per visione',
    'info',
    'Il destinatario ha letto la notifica'
  );
});

test('return notification status, label and color - CANCELED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.CANCELED,
    'Annullata',
    'warning',
    "L'ente ha annullato l'invio della notifica"
  );
});