import { NotificationStatus } from '../../types/NotificationStatus';
import { getNotificationStatusLabelAndColor } from '../status.utility';

function testStatusLabelAndColorFn(
  status: NotificationStatus,
  labelToTest: string,
  colorToTest: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary',
  tooltipToTest: string
) {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(status);
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  expect(tooltip).toBe(tooltipToTest);
}
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: any) => str,
    };
  },
}));

test('return notification status, label and color - DELIVERED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.DELIVERED,
    'Consegnata',
    'default',
    'Il destinatario ha ricevuto la notifica'
  );
});

test('return notification status, label and color - DELIVERING', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.DELIVERING,
    'In inoltro',
    'default',
    "L'invio della notifica è in corso"
  );
});

test('return notification status, label and color - UNREACHABLE', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.UNREACHABLE,
    'Destinatario irreperibile',
    'error',
    'Il destinatario non risulta reperibile'
  );
});

test('return notification status, label and color - PAID', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.PAID,
    'Pagata',
    'success',
    'Il destinatario ha pagato la notifica'
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

test('return notification status, label and color - IN_VALIDATION', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.IN_VALIDATION,
    'In Validazione',
    'default',
    'La notifica è in fase di validazione'
  );
});

test('return notification status, label and color - REFUSED', () => {
  testStatusLabelAndColorFn(
    NotificationStatus.REFUSED,
    'Non valida',
    'error',
    'La notifica non rispetta le validazioni'
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
