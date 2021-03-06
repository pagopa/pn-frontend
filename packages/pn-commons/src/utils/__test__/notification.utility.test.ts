import _ from 'lodash';
import {
  AnalogWorkflowDetails,
  DigitalDomicileType,
  NotHandledDetails,
  PhysicalCommunicationType,
  SendCourtesyMessageDetails,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
  NotificationStatus
} from '../../types';
import { formatToTimezoneString, getNextDay } from '../date.utility';
import {
  filtersApplied,
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  parseNotificationDetail,
} from '../notification.utility';
import { notificationFromBe, parsedNotification } from './test-utils';

const parsedNotificationCopy = _.cloneDeep(parsedNotification);

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
  const { label, description } = getNotificationTimelineStatusInfos(
    parsedNotificationCopy.timeline[0],
    parsedNotificationCopy.recipients
  ) as { label: string; description: string };
  expect(label).toBe(labelToTest);
  expect(description).toBe(descriptionToTest);
}

describe('notification utility functions', () => {
  it('return notification status infos - DELIVERED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.DELIVERED,
      'Consegnata',
      'default',
      'La notifica è stata consegnata'
    );
  });

  it('return notification status infos - DELIVERING', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.DELIVERING,
      'Invio in corso',
      'default',
      "L'invio della notifica è in corso"
    );
  });

  it('return notification status infos - UNREACHABLE', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.UNREACHABLE,
      'Destinatario irreperibile',
      'error',
      'Il destinatario non è reperibile'
    );
  });

  it('return notification status infos - PAID', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.PAID,
      'Pagata',
      'success',
      'Il destinatario ha pagato i costi della notifica'
    );
  });

  it('return notification status infos - ACCEPTED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.ACCEPTED,
      'Depositata',
      'default',
      "L'ente ha depositato la notifica"
    );
  });

  it('return notification status infos - EFFECTIVE_DATE', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.EFFECTIVE_DATE,
      'Perfezionata per decorrenza termini',
      'info',
      'Il destinatario non ha letto la notifica'
    );
  });

  it('return notification status infos - VIEWED', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.VIEWED,
      'Perfezionata per visione',
      'info',
      'Il destinatario ha letto la notifica'
    );
  });

  it('return notification status infos - VIEWED_AFTER_DEADLINE', () => {
    testNotificationStatusInfosFn(
        NotificationStatus.VIEWED_AFTER_DEADLINE,
        'Visualizzata',
        'success',
        'Il destinatario ha visualizzato la notifica'
    );
  });

  it('return notification status infos - CANCELLED', () => {
    testNotificationStatusInfosFn(
        NotificationStatus.CANCELLED,
        'Annullata',
        'warning',
        "L'ente ha annullato l'invio della notifica"
    );
  });

  it('return notifications filters count (no filters)', () => {
    const date = new Date();
    const count = filtersApplied(
      { startDate: formatToTimezoneString(date), endDate: formatToTimezoneString(getNextDay(date)) },
      { startDate: formatToTimezoneString(date), endDate: formatToTimezoneString(getNextDay(date)) }
    );
    expect(count).toEqual(0);
  });

  it('return notifications filters count (with filters)', () => {
    const date = new Date();
    const count = filtersApplied(
      { startDate: formatToTimezoneString(date), endDate: formatToTimezoneString(getNextDay(date)), iunMatch: 'mocked-iun', recipientId: 'mocked-recipient' },
      { startDate: formatToTimezoneString(date), endDate: formatToTimezoneString(getNextDay(date)), iunMatch: undefined, recipientId: undefined },
    );
    expect(count).toEqual(2);
  });
});

describe('timeline utility functions', () => {
  it('return timeline status infos - SCHEDULE_ANALOG_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SCHEDULE_ANALOG_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via cartacea',
      "L'invio della notifica per via cartacea è in preparazione."
    );
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via digitale',
      "È in corso l'invio della notifica per via digitale."
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.EMAIL;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (parsedNotificationCopy.timeline[0].details as SendCourtesyMessageDetails).digitalAddress = {
      type: DigitalDomicileType.EMAIL,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio del messaggio di cortesia',
      "È in corso l'invio del messaggio di cortesia a Nome Cognome tramite email"
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.PEC;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC',
      "È in corso l'invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail"
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE_FEEDBACK', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.PEC;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC riuscito',
      "L' invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail è riuscito."
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE_FAILURE', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.PEC;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'KO';
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio per via digitale fallito',
      "L'invio della notifica a Nome Cognome per via digitale non è riuscito."
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (parsedNotificationCopy.timeline[0].details as AnalogWorkflowDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'nome@cognome.mail',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata semplice',
      "È in corso l'invio della notifica a Nome Cognome all'indirizzo nome@cognome.mail tramite raccomandata semplice."
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE (890)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.REGISTERED_LETTER_890;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'nome@cognome.mail',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata 890',
      "È in corso l'invio della notifica a Nome Cognome all'indirizzo nome@cognome.mail tramite raccomandata 890."
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE (A/R)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'nome@cognome.mail',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFn(
      'Invio via raccomandata A/R',
      "È in corso l'invio della notifica a Nome Cognome all'indirizzo nome@cognome.mail tramite raccomandata A/R."
    );
  });

  it('return timeline status infos - SEND_PAPER_FEEDBACK', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_PAPER_FEEDBACK;
    testTimelineStatusInfosFn(
      'Aggiornamento stato raccomandata',
      'Si allega un aggiornamento dello stato della raccomandata.'
    );
  });

  it('return parsed notification detail response', () => {
    const calculatedParsedNotification = parseNotificationDetail(notificationFromBe);
    expect(calculatedParsedNotification).toStrictEqual(parsedNotification);
  });

  it('return legalFact label - NO SEND_PAPER_FEEDBACK', () => {
    const label = getLegalFactLabel(TimelineCategory.GET_ADDRESS, {
      attestation: 'mocked-legalFact-label',
      receipt: 'mocked-recipient-label',
    });
    expect(label).toBe('mocked-legalFact-label');
  });

  it('return legalFact label - SEND_PAPER_FEEDBACK', () => {
    const label = getLegalFactLabel(TimelineCategory.SEND_PAPER_FEEDBACK, {
      attestation: 'mocked-legalFact-label',
      receipt: 'mocked-recipient-label',
    });
    expect(label).toBe('mocked-recipient-label');
  });

  it('return legalFact label - DIGITAL_FAILURE_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via digitale non riuscito',
      `L'invio per via digitale della notifica non è riuscito.`
    );
  });

  // PN-1647
  it('return timeline status infos - NOT_HANDLED', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOT_HANDLED;
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reasonCode = '001';
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reason = 'Paper message not handled';
    testTimelineStatusInfosFn(
      'Annullata',
      "La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma."
    );
  });
});
