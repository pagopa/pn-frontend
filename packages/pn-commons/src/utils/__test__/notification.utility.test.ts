import _ from 'lodash';
import {
  AnalogWorkflowDetails,
  DigitalDomicileType,
  LegalFactType,
  NotHandledDetails,
  PhysicalCommunicationType,
  SendCourtesyMessageDetails,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
  NotificationStatus,
} from '../../types';
import { NotificationDeliveryMode, NotificationStatusHistory, ResponseStatus } from '../../types/NotificationDetail';
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
  tooltipToTest: string,
  recipient?: string
) {
  const { label, color, tooltip } = getNotificationStatusInfos({status, recipient, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] });
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  expect(tooltip).toBe(tooltipToTest);
}

function testNotificationStatusInfosFnIncludingDescription(
  status: NotificationStatusHistory,
  labelToTest: string,
  colorToTest: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary',
  tooltipToTest: string,
  descriptionToTest: string,
) {
  const { label, color, tooltip, description } = getNotificationStatusInfos(status);
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  expect(tooltip).toBe(tooltipToTest);
  expect(description).toBe(descriptionToTest);
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
  it('return notification status infos - DELIVERED - analog shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.ANALOG },
      'Consegnata',
      'default',
      'La notifica è stata consegnata',
      'La notifica è stata consegnata per via analogica.'
    );
  });

  it('return notification status infos - DELIVERED - digital shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.DIGITAL },
      'Consegnata',
      'default',
      'La notifica è stata consegnata',
      'La notifica è stata consegnata per via digitale.'
    );
  });

  it('return notification status infos - DELIVERED - unspecified shipment mode', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      'Consegnata',
      'default',
      'La notifica è stata consegnata',
      'La notifica è stata consegnata.'
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

  it('return notification status infos - VIEWED (with recipient infos)', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.VIEWED,
      'Perfezionata per visione',
      'info',
      'Il delegato Mario Rossi ha letto la notifica',
      'Mario Rossi'
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

  it('return notification status infos - VIEWED_AFTER_DEADLINE (with recipient infos)', () => {
    testNotificationStatusInfosFn(
      NotificationStatus.VIEWED_AFTER_DEADLINE,
      'Visualizzata',
      'success',
      'Il delegato Mario Rossi ha visualizzato la notifica',
      'Mario Rossi'
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
      {
        startDate: formatToTimezoneString(date),
        endDate: formatToTimezoneString(getNextDay(date)),
      },
      { startDate: formatToTimezoneString(date), endDate: formatToTimezoneString(getNextDay(date)) }
    );
    expect(count).toEqual(0);
  });

  it('return notifications filters count (with filters)', () => {
    const date = new Date();
    const count = filtersApplied(
      {
        startDate: formatToTimezoneString(date),
        endDate: formatToTimezoneString(getNextDay(date)),
        iunMatch: 'mocked-iun',
        recipientId: 'mocked-recipient',
      },
      {
        startDate: formatToTimezoneString(date),
        endDate: formatToTimezoneString(getNextDay(date)),
        iunMatch: undefined,
        recipientId: undefined,
      }
    );
    expect(count).toEqual(2);
  });
});

describe('timeline utility functions', () => {
  it('return timeline status infos - SCHEDULE_ANALOG_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SCHEDULE_ANALOG_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via cartacea in preparazione',
      "L'invio della notifica per via cartacea a Nome Cognome è in preparazione."
    );
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via digitale in preparazione',
      "L'invio della notifica per via digitale a Nome Cognome è in preparazione."
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

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK (failure)', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.PEC;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'KO';
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC non riuscito',
      "L'invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail non è riuscito perché la casella è satura, non valida o inattiva."
    );
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK (success)', () => {
    parsedNotificationCopy.recipients[0].digitalDomicile!.type = DigitalDomicileType.PEC;
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'OK';
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFn(
      'Invio via PEC riuscito',
      "L'invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail è riuscito."
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
      PhysicalCommunicationType.AR_REGISTERED_LETTER;
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

  it('return timeline status infos - SEND_ANALOG_FEEDBACK (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.KO;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFn(
      'Invio per via cartacea non riuscito',
      'Il tentativo di invio della notifica per via cartacea a Nome Cognome non è riuscito.'
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.OK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFn(
      'Invio per via cartacea riuscito',
      'Il tentativo di invio della notifica per via cartacea a Nome Cognome è riuscito.'
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C008';
    testTimelineStatusInfosFn(
      'Invio via PEC non preso in carico',
      "L'invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail non è stato preso in carico."
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C001';
    testTimelineStatusInfosFn(
      'Invio via PEC preso in carico',
      "L'invio della notifica a Nome Cognome all'indirizzo PEC nome@cognome.mail è stato preso in carico."
    );
  });

  it('return parsed notification detail response', () => {
    const calculatedParsedNotification = parseNotificationDetail(notificationFromBe);
    expect(calculatedParsedNotification).toStrictEqual(parsedNotification);
  });

  it('return legalFact label - default', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.GET_ADDRESS;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('Attestazione opponibile a terzi');
  });

  it('return legalFact label - SEND_ANALOG_FEEDBACK (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.OK;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('Ricevuta di consegna raccomandata');
  });

  it('return legalFact label - SEND_ANALOG_FEEDBACK (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.KO;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('Ricevuta di mancata consegna raccomandata');
  });

  it('return legalFact label - SENDER_ACK', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.REQUEST_ACCEPTED;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.SENDER_ACK);
    expect(label).toBe('Attestazione opponibile a terzi: notifica presa in carico');
  });

  it('return legalFact label - DIGITAL_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_SUCCESS_WORKFLOW;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.DIGITAL_DELIVERY
    );
    expect(label).toBe('Attestazione opponibile a terzi: notifica digitale');
  });

  it('return legalFact label - DIGITAL_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.DIGITAL_DELIVERY
    );
    expect(label).toBe('Attestazione opponibile a terzi: mancato recapito digitale');
  });

  it('return legalFact label - ANALOG_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.ANALOG_SUCCESS_WORKFLOW;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.ANALOG_DELIVERY
    );
    expect(label).toBe('Attestazione opponibile a terzi: conformità');
  });

  it('return legalFact label - RECIPIENT_ACCESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOTIFICATION_VIEWED;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.RECIPIENT_ACCESS
    );
    expect(label).toBe('Attestazione opponibile a terzi: avvenuto accesso');
  });

  it('return legalFact label - SEND_ANALOG_PROGRESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('Ricevuta di accettazione raccomandata');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C001';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('Ricevuta di accettazione PEC');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C008';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('Ricevuta di mancata accettazione PEC');
  });

  it('return legalFact label - SEND_DIGITAL_FEEDBACK (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'OK';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('Ricevuta di consegna PEC');
  });

  it('return legalFact label - SEND_DIGITAL_FEEDBACK (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'KO';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('Ricevuta di mancata consegna PEC');
  });

  it('return legalFact label - DIGITAL_FAILURE_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    testTimelineStatusInfosFn(
      'Invio per via digitale fallito',
      `L'invio per via digitale della notifica a Nome Cognome è fallito.`
    );
  });

  // PN-1647
  it('return timeline status infos - NOT_HANDLED', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOT_HANDLED;
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reasonCode = '001';
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reason =
      'Paper message not handled';
    testTimelineStatusInfosFn(
      'Annullata',
      'La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.'
    );
  });
});
