import { NotificationStatus } from '../../redux/dashboard/types';

import { getNotificationStatusLabelAndColor } from '../status.utility';

test('return notification status, label and color - DELIVERED', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(
    NotificationStatus.DELIVERED
  );
  expect(label).toBe('Consegnata');
  expect(color).toBe('default');
  expect(tooltip).toBe('Il destinatario ha ricevuto la notifica');
});

test('return notification status, label and color - DELIVERING', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(
    NotificationStatus.DELIVERING
  );
  expect(label).toBe('In inoltro');
  expect(color).toBe('default');
  expect(tooltip).toBe("L'invio della notifica è in corso");
});

test('return notification status, label and color - UNREACHABLE', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(
    NotificationStatus.UNREACHABLE
  );
  expect(label).toBe('Destinatario irreperibile');
  expect(color).toBe('error');
  expect(tooltip).toBe('Il destinatario non risulta reperibile');
});

test('return notification status, label and color - PAID', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(NotificationStatus.PAID);
  expect(label).toBe('Pagata');
  expect(color).toBe('success');
  expect(tooltip).toBe('Il destinatario ha pagato la notifica');
});

test('return notification status, label and color - RECEIVED', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(NotificationStatus.RECEIVED);
  expect(label).toBe('Depositata');
  expect(color).toBe('default');
  expect(tooltip).toBe("L'ente ha depositato la notifica");
});

test('return notification status, label and color - EFFECTIVE_DATE', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(
    NotificationStatus.EFFECTIVE_DATE
  );
  expect(label).toBe('Perfezionata per decorrenza termini');
  expect(color).toBe('info');
  expect(tooltip).toBe('Il destinatario non ha letto la notifica');
});

test('return notification status, label and color - VIEWED', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(NotificationStatus.VIEWED);
  expect(label).toBe('Perfezionata per visione');
  expect(color).toBe('info');
  expect(tooltip).toBe('Il destinatario ha letto la notifica');
});

test('return notification status, label and color - CANCELED', () => {
  const { label, color, tooltip } = getNotificationStatusLabelAndColor(NotificationStatus.CANCELED);
  expect(label).toBe('Annullata');
  expect(color).toBe('warning');
  expect(tooltip).toBe("L'ente ha annullato l'invio della notifica");
});
