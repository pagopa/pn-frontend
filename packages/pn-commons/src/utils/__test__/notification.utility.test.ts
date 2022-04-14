import {
  AnalogWorkflowDetails,
  DeliveryMode,
  DigitalDomicileType,
  NotificationPathChooseDetails,
  PhysicalCommunicationType,
  SendCourtesyMessageDetails,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
} from '../../types/NotificationDetail';
import { NotificationStatus } from '../../types/NotificationStatus';
import { getLegalFactLabel, getNotificationStatusInfos, getNotificationTimelineStatusInfos, parseNotificationDetail } from '../notification.utility';
import { recipients, timeline, notificationFromBe } from './test-utils';

function testNotificationStatusInfosFn(
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

function testTimelineStatusInfosFn(labelToTest: string, descriptionToTest: string) {
  const { label, description } = getNotificationTimelineStatusInfos(timeline[0], recipients);
  expect(label).toBe(labelToTest);
  expect(description).toBe(descriptionToTest);
}

describe('notification utility functions', () => {
  test('return notification status infos - DELIVERED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.DELIVERED,
      'Consegnata',
      'default',
      'La notifica è stata consegnata'
    );
  });
  
  test('return notification status infos - DELIVERING', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.DELIVERING,
      'Invio in corso',
      'default',
      "L'invio della notifica è in corso"
    );
  });
  
  test('return notification status infos - UNREACHABLE', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.UNREACHABLE,
      'Destinatario irreperibile',
      'error',
      'Il destinatario non è reperibile'
    );
  });
  
  test('return notification status infos - PAID', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.PAID,
      'Pagata',
      'success',
      'Il destinatario ha pagato i costi della notifica'
    );
  });
  
  test('return notification status infos - ACCEPTED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.ACCEPTED,
      'Depositata',
      'default',
      "L'ente ha depositato la notifica"
    );
  });
  
  test('return notification status infos - EFFECTIVE_DATE', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.EFFECTIVE_DATE,
      'Perfezionata per decorrenza termini',
      'info',
      'Il destinatario non ha letto la notifica'
    );
  });
  
  test('return notification status infos - VIEWED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.VIEWED,
      'Perfezionata per visione',
      'info',
      'Il destinatario ha letto la notifica'
    );
  });
  
  test('return notification status infos - CANCELED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.CANCELED,
      'Annullata',
      'warning',
      "L'ente ha annullato l'invio della notifica"
    );
  });
});

describe('timeline utility functions', () => {
  test('return timeline status infos - NOTIFICATION_PATH_CHOOSE (analog)', () => {
    timeline[0].category = TimelineCategory.NOTIFICATION_PATH_CHOOSE;
    (timeline[0].details as NotificationPathChooseDetails).deliveryMode = DeliveryMode.ANALOG;
    testTimelineStatusInfosFn(
      'Invio per via cartacea',
      "È in corso l' invio della notifica per via cartacea."
    );
  });
  
  test('return timeline status infos - NOTIFICATION_PATH_CHOOSE (digital)', () => {
    timeline[0].category = TimelineCategory.NOTIFICATION_PATH_CHOOSE;
    (timeline[0].details as NotificationPathChooseDetails).deliveryMode = DeliveryMode.DIGITAL;
    testTimelineStatusInfosFn(
      'Invio per via digitale',
      "È in corso l' invio della notifica per via digitale."
    );
  });
  
  test('return timeline status infos - SEND_COURTESY_MESSAGE', () => {
    timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (timeline[0].details as SendCourtesyMessageDetails).address = {
      type: DigitalDomicileType.EMAIL,
      address: 'mocked@address.mail.it',
    };
    testTimelineStatusInfosFn(
      'Invio del messaggio di cortesia',
      "È in corso l' invio del messaggio di cortesia a Nome Cognome tramite email"
    );
  });
  
  test('return timeline status infos - SEND_DIGITAL_DOMICILE', () => {
    timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE;
    (timeline[0].details as SendDigitalDetails).address = {
      type: DigitalDomicileType.PEC,
      address: 'mocked@address.mail.it',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC',
      "È in corso l' invio della notifica a Nome Cognome all'indirizzo PEC mocked@address.mail.it"
    );
  });
  
  test('return timeline status infos - SEND_DIGITAL_DOMICILE_FEEDBACK', () => {
    timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK;
    (timeline[0].details as SendDigitalDetails).address = {
      type: DigitalDomicileType.PEC,
      address: 'mocked@address.mail.it',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC riuscito',
      "L' invio della notifica a Nome Cognome all'indirizzo PEC mocked@address.mail.it è riuscito."
    );
  });
  
  test('return timeline status infos - SEND_DIGITAL_DOMICILE_FAILURE', () => {
    timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE_FAILURE;
    (timeline[0].details as SendDigitalDetails).address = {
      type: DigitalDomicileType.PEC,
      address: 'mocked@address.mail.it',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC non riuscito',
      "L' invio della notifica a Nome Cognome all'indirizzo PEC mocked@address.mail.it non è riuscito."
    );
  });
  
  test('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER', () => {
    timeline[0].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (timeline[0].details as AnalogWorkflowDetails).address = {
      at: '',
      addressDetails: '',
      address: 'mocked@address.mail.it',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata semplice',
      "È in corso l' invio della notifica a Nome Cognome all'indirizzo mocked@address.mail.it tramite raccomandata semplice."
    );
  });
  
  test('return timeline status infos - SEND_ANALOG_DOMICILE (890)', () => {
    timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (timeline[0].details as SendPaperDetails).serviceLevel = PhysicalCommunicationType.REGISTERED_LETTER_890;
    (timeline[0].details as SendPaperDetails).address = {
      at: '',
      addressDetails: '',
      address: 'mocked@address.mail.it',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata 890',
      "È in corso l' invio della notifica a Nome Cognome all'indirizzo mocked@address.mail.it tramite raccomandata 890."
    );
  });
  
  test('return timeline status infos - SEND_ANALOG_DOMICILE (A/R)', () => {
    timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (timeline[0].details as SendPaperDetails).serviceLevel = PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER;
    (timeline[0].details as SendPaperDetails).address = {
      at: '',
      addressDetails: '',
      address: 'mocked@address.mail.it',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata A/R',
      "È in corso l' invio della notifica a Nome Cognome all'indirizzo mocked@address.mail.it tramite raccomandata A/R."
    );
  });
  
  test('return timeline status infos - SEND_PAPER_FEEDBACK', () => {
    timeline[0].category = TimelineCategory.SEND_PAPER_FEEDBACK;
    testTimelineStatusInfosFn(
      'Aggiornamento stato raccomandata',
      "Si allega un aggiornamento dello stato della raccomandata."
    );
  });

  test('return parsed notification detail response', () => {
    const parsedNotification = parseNotificationDetail(notificationFromBe);
    expect(parsedNotification.notificationStatusHistory[0].steps![0]).toStrictEqual({...timeline[0], hidden: false});
    expect(parsedNotification.notificationStatusHistory[1].steps![0]).toStrictEqual({...timeline[1], hidden: false});
  });

  test('return legalFact label - NO SEND_PAPER_FEEDBACK', () => {
    const label = getLegalFactLabel(TimelineCategory.GET_ADDRESS, {attestation: "mocked-legalFact-label", receipt: "mocked-recipient-label"});
    expect(label).toBe('mocked-legalFact-label');
  });

  test('return legalFact label - SEND_PAPER_FEEDBACK', () => {
    const label = getLegalFactLabel(TimelineCategory.SEND_PAPER_FEEDBACK, {attestation: "mocked-legalFact-label", receipt: "mocked-recipient-label"});
    expect(label).toBe('mocked-recipient-label');
  });
});

