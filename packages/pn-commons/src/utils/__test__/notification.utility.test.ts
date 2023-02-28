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
import { DigitalDomicileTypeForCourtesyMessageOnly, NotificationDeliveryMode, NotificationDetail, NotificationDetailRecipient, NotificationStatusHistory, ResponseStatus } from '../../types/NotificationDetail';
import { formatToTimezoneString, getNextDay } from '../date.utility';
import {
  filtersApplied,
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  parseNotificationDetail,
} from '../notification.utility';
import { notificationFromBe, parsedNotification, parsedNotificationTwoRecipients } from './test-utils';


jest.mock('../../services/localization.service', () => {
  const original = jest.requireActual('../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_1: string, key: string, _2: string, data: any) => {
      if (key === 'status.delegate' && data && data.name) {
        return `status.delegate.${data.name}`;
      } else {
        return data ? `${key} /-/ ${JSON.stringify(data)}` : key
      }
    },
  };
});


let parsedNotificationCopy = _.cloneDeep(parsedNotification);
let parsedNotificationTwoRecipientsCopy = _.cloneDeep(parsedNotificationTwoRecipients);

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
  status: NotificationStatusHistory | NotificationStatus,
  recipients: Array<NotificationDetailRecipient | string> | undefined,
  labelToTest: string,
  colorToTest: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary',
  tooltipToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any
) {
  const { label, color, tooltip, description } = recipients ? getNotificationStatusInfos(status, { recipients }) : getNotificationStatusInfos(status);
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  if (description.indexOf(" /-/ ") > -1) {
    const [bareDescription, descriptionDataAsString] = description.split(" /-/ ");
    const bareTooltip = tooltip.split(" /-/ ")[0];
    expect(bareTooltip).toBe(tooltipToTest);
    expect(bareDescription).toBe(descriptionToTest);
    console.log(description);
    console.log(description.split(" /-/ "));
    expect(JSON.parse(descriptionDataAsString)).toEqual(descriptionDataToTest);
  } else {
    expect(tooltip).toBe(tooltipToTest);
    expect(description).toBe(descriptionToTest);
  }
}

function testTimelineStatusInfosFn(notification: NotificationDetail, timelineIndex: number, labelToTest: string, descriptionToTest: string, descriptionDataToTest?: any) {
  const { label, description } = getNotificationTimelineStatusInfos(
    notification.timeline[timelineIndex],
    notification.recipients
  ) as { label: string; description: string };
  expect(label).toBe(`detail.timeline.${labelToTest}`);
  if (description.indexOf(" /-/ ") > -1) {
    const [bareDescription, descriptionDataAsString] = description.split(" /-/ ");
    expect(bareDescription).toBe(`detail.timeline.${descriptionToTest}`);
    expect(JSON.parse(descriptionDataAsString)).toEqual(descriptionDataToTest);
  } else {
    expect(description).toBe(`detail.timeline.${descriptionToTest}`);
  }
}

function testTimelineStatusInfosFnSingle(labelToTest: string, descriptionToTest: string, descriptionDataToTest?: any) {
  testTimelineStatusInfosFn(parsedNotificationCopy, 0, labelToTest, descriptionToTest, descriptionDataToTest);
}

function testTimelineStatusInfosFnMulti0(labelToTest: string, descriptionToTest: string, descriptionDataToTest?: any) {
  testTimelineStatusInfosFn(parsedNotificationTwoRecipientsCopy, 0, labelToTest, descriptionToTest, descriptionDataToTest);
}

function testTimelineStatusInfosFnMulti1(labelToTest: string, descriptionToTest: string, descriptionDataToTest?: any) {
  parsedNotificationTwoRecipientsCopy.timeline[0].details.recIndex = 1;
  testTimelineStatusInfosFn(parsedNotificationTwoRecipientsCopy, 0, labelToTest, descriptionToTest, descriptionDataToTest);
}

describe('notification status texts', () => {
  it('return notification status infos - DELIVERED - single recipient - analog shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.ANALOG },
      ["single-recipient"],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description-with-delivery-mode',
      { deliveryMode: 'status.deliveryMode.analog' }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - digital shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.DIGITAL },
      ["single-recipient"],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description-with-delivery-mode',
      { deliveryMode: 'status.deliveryMode.digital' }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - no delivery mode specified', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["single-recipient"],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description',
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - analog shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.ANALOG },
      ["recipient-1", "recipient-2"],
      'status.delivered-multirecipient',
      'default',
      'status.delivered-tooltip-multirecipient',
      'status.delivered-description-multirecipient',
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - digital shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], deliveryMode: NotificationDeliveryMode.DIGITAL },
      ["recipient-1", "recipient-2"],
      'status.delivered-multirecipient',
      'default',
      'status.delivered-tooltip-multirecipient',
      'status.delivered-description-multirecipient',
    );
  });

  it('return notification status infos - DELIVERING', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.DELIVERING, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["single-recipient"],
      'status.delivering',
      'default',
      'status.delivering-tooltip',
      'status.delivering-description',
    );
  });

  it('return notification status infos - DELIVERING - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.DELIVERING,
      undefined,
      'status.delivering',
      'default',
      'status.delivering-tooltip',
      'status.delivering-description',
    );
  });

  it('return notification status infos - UNREACHABLE - single recipient - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.UNREACHABLE,
      ["single-recipient"],
      'status.unreachable',
      'error',
      'status.unreachable-tooltip',
      'status.unreachable-description',
    );
  });

  it('return notification status infos - UNREACHABLE - multi recipient - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.UNREACHABLE,
      ["recipient-1", "recipient-2"],
      'status.unreachable-multirecipient',
      'error',
      'status.unreachable-tooltip-multirecipient',
      'status.unreachable-description-multirecipient',
    );
  });

  it('return notification status infos - PAID - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.PAID,
      undefined,
      'status.paid',
      'success',
      'status.paid-tooltip',
      'status.paid-description',
    );
  });

  it('return notification status infos - ACCEPTED', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.ACCEPTED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      undefined,
      'status.accepted',
      'default',
      'status.accepted-tooltip',
      'status.accepted-description',
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - single recipient', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.EFFECTIVE_DATE, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["single-recipient"],
      'status.effective-date',
      'info',
      'status.effective-date-tooltip',
      'status.effective-date-description',
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - multi recipient', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.EFFECTIVE_DATE, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["recipient-1", "recipient-2"],
      'status.effective-date-multirecipient',
      'info',
      'status.effective-date-tooltip-multirecipient',
      'status.effective-date-description-multirecipient',
    );
  });

  it('return notification status infos - VIEWED - single recipient - no delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["single-recipient"],
      'status.viewed',
      'info',
      'status.viewed-tooltip',
      'status.viewed-description',
      { subject: "status.recipient" }
    );
  });

  it('return notification status infos - VIEWED - single recipient - including delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], recipient: "Mario Rossi" },
      ["single-recipient"],
      'status.viewed',
      'info',
      'status.viewed-tooltip',
      'status.viewed-description',
      { subject: "status.delegate.Mario Rossi" }
    );
  });

  it('return notification status infos - VIEWED - multi recipient - no delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["recipient-1", "recipient-2"],
      'status.viewed-multirecipient',
      'info',
      'status.viewed-tooltip-multirecipient',
      'status.viewed-description-multirecipient',
      { subject: "status.recipient" }
    );
  });

  it('return notification status infos - VIEWED_AFTER_DEADLINE - single recipient - no delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED_AFTER_DEADLINE, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [] },
      ["single-recipient"],
      'status.viewed-after-deadline',
      'success',
      'status.viewed-after-deadline-tooltip',
      'status.viewed-after-deadline-description',
      { subject: "status.recipient" }
    );
  });

  it('return notification status infos - VIEWED_AFTER_DEADLINE - single recipient - including delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED_AFTER_DEADLINE, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], recipient: "Gloria Gaynor" },
      ["single-recipient"],
      'status.viewed-after-deadline',
      'success',
      'status.viewed-after-deadline-tooltip',
      'status.viewed-after-deadline-description',
      { subject: "status.delegate.Gloria Gaynor" }
    );
  });

  it('return notification status infos - VIEWED_AFTER_DEADLINE - multi recipient - including delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {status: NotificationStatus.VIEWED_AFTER_DEADLINE, activeFrom: '2023-01-26T13:57:16.42843144Z', relatedTimelineElements: [], recipient: 'Laura Bissoli' },
      ["recipient-1", "recipient-2"],
      'status.viewed-after-deadline-multirecipient',
      'success',
      'status.viewed-after-deadline-tooltip-multirecipient',
      'status.viewed-after-deadline-description-multirecipient',
      { subject: "status.delegate.Laura Bissoli" }
    );
  });

  it('return notification status infos - CANCELLED - passing status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.CANCELLED,
      undefined,
      'status.canceled',
      'warning',
      'status.canceled-tooltip',
      'status.canceled-description',
    );
  });
});

describe.skip('timeline event description', () => {
  beforeEach(() => {
    parsedNotificationCopy = _.cloneDeep(parsedNotification);
    parsedNotificationTwoRecipientsCopy = _.cloneDeep(parsedNotificationTwoRecipients);    
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFnSingle(
      'schedule-digital-workflow',
      'schedule-digital-workflow-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)' }
    );
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW - multirecipient - recipient 0', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFnMulti0(
      'schedule-digital-workflow',
      'schedule-digital-workflow-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)' }
    );
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW - multirecipient - recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFnMulti1(
      'schedule-digital-workflow',
      'schedule-digital-workflow-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)' }
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - single recipient - email', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (parsedNotificationCopy.timeline[0].details as SendCourtesyMessageDetails).digitalAddress = {
      type: DigitalDomicileType.EMAIL,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFnSingle(
      'send-courtesy-message',
      'send-courtesy-message-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', type: "email" }
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - multi recipient 0 - sms', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendCourtesyMessageDetails).digitalAddress = {
      type: DigitalDomicileTypeForCourtesyMessageOnly.SMS,
      address: '+393334445566',
    };
    testTimelineStatusInfosFnMulti0(
      'send-courtesy-message',
      'send-courtesy-message-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', type: "sms" }
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - multi recipient 1 - app IO', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendCourtesyMessageDetails).digitalAddress = {
      type: DigitalDomicileType.APPIO,
      address: '+393334445566',
    };
    testTimelineStatusInfosFnMulti1(
      'send-courtesy-message',
      'send-courtesy-message-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', type: "app IO" }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'toto86@cognome.mail',
    };
    testTimelineStatusInfosFnSingle(
      'send-digital-domicile',
      'send-digital-domicile-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: "toto86@cognome.mail" }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'toto86@cognome.mail',
    };
    testTimelineStatusInfosFnMulti1(
      'send-digital-domicile',
      'send-digital-domicile-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: "toto86@cognome.mail" }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - failure - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C008';
    testTimelineStatusInfosFnSingle(
      'send-digital-progress-error',
      'send-digital-progress-error-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: 'nome@cognome.mail' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - failure - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C010';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      address: 'titi99@some.org',
      type: DigitalDomicileType.PEC,
    };
    testTimelineStatusInfosFnMulti1(
      'send-digital-progress-error',
      'send-digital-progress-error-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: 'titi99@some.org' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - success - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C001';
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      address: 'titi35@other.org',
      type: DigitalDomicileType.PEC,
    };
    testTimelineStatusInfosFnSingle(
      'send-digital-progress-success',
      'send-digital-progress-success-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: 'titi35@other.org' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - failure - multi recipient 0', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).eventCode = 'DP00';
    testTimelineStatusInfosFnMulti0(
      'send-digital-progress-success',
      'send-digital-progress-success-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: 'nome@cognome.mail' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK - failure - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'KO';
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome.altronome@cognome.mail',
    };
    testTimelineStatusInfosFnSingle(
      'send-digital-error',
      'send-digital-error-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: "nome.altronome@cognome.mail" }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK - success - multirecipient 0', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'OK';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome0@cognome.mail',
    };
    testTimelineStatusInfosFnMulti0(
      'send-digital-success',
      'send-digital-success-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: "nome0@cognome.mail" }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK - success - multirecipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'OK';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'nome0@cognome.mail',
    };
    testTimelineStatusInfosFnMulti1(
      'send-digital-success',
      'send-digital-success-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: "nome0@cognome.mail" }
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER - single recipient - full address', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (parsedNotificationCopy.timeline[0].details as AnalogWorkflowDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'Via Mazzini 1848',
      zip: '98036',
      municipality: 'Graniti',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnSingle(
      'send-simple-registered-letter',
      'send-simple-registered-letter-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', 
        address: 'Via Mazzini 1848 - Graniti (98036)', simpleAddress: 'Via Mazzini 1848' }
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER - multi recipient 0 - just bare address', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as AnalogWorkflowDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'Via Roma 135',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnMulti0(
      'send-simple-registered-letter',
      'send-simple-registered-letter-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', 
        address: 'Via Roma 135', simpleAddress: 'Via Roma 135' }
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER - multi recipient 1 - no address at all', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as AnalogWorkflowDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: '',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnMulti1(
      'send-simple-registered-letter',
      'send-simple-registered-letter-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: '', simpleAddress: '' }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - 890 - single recipient - bare address', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.REGISTERED_LETTER_890;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'Via Manganelli 1',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnSingle(
      'send-analog-domicile-890',
      'send-analog-domicile-890-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', 
        address: 'Via Manganelli 1', simpleAddress: 'Via Manganelli 1' }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - 890 - multi recipient 1 - full address', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.REGISTERED_LETTER_890;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: 'Gaetano Papino',
      addressDetails: '',
      address: 'Via Manganelli 1',
      zip: '98030',
      municipality: 'Francavilla di Sicilia',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnMulti1(
      'send-analog-domicile-890',
      'send-analog-domicile-890-description-multirecipient',
      { name: `Catena Dall'Olio`, taxId: '(mocked-taxId2)', 
        address: 'Via Manganelli 1 - Francavilla di Sicilia (98030)', simpleAddress: 'Via Manganelli 1' }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - A/R - single recipient - full address', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.AR_REGISTERED_LETTER;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'Via Umberto 45',
      zip: '98035',
      municipality: 'Motta Camastra',
      province: 'Messina',
      foreignState: 'Italia',
    };
    testTimelineStatusInfosFnSingle(
      'send-analog-domicile-ar',
      'send-analog-domicile-ar-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', 
        address: 'Via Umberto 45 - Motta Camastra (98035)', simpleAddress: 'Via Umberto 45' }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - A/R - multi recipient 0 - bare address', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.AR_REGISTERED_LETTER;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      at: 'Gaetano Papino',
      addressDetails: '',
      address: 'Via Manganelli 1',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    };
    testTimelineStatusInfosFnMulti0(
      'send-analog-domicile-ar',
      'send-analog-domicile-ar-description-multirecipient',
      { name: 'Lorenza Catrufizzio', taxId: '(mocked-taxId)', 
        address: 'Via Manganelli 1', simpleAddress: 'Via Manganelli 1' }
    );
  });

  it('return timeline status infos - SEND_ANALOG_PROGRESS - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    testTimelineStatusInfosFnSingle(
      'send-analog-progress',
      'send-analog-progress-description',
    );
  });

  it('return timeline status infos - SEND_ANALOG_PROGRESS - multi recipient', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    testTimelineStatusInfosFnMulti1(
      'send-analog-progress',
      'send-analog-progress-description-multirecipient',
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - failure - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.KO;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFnSingle(
      'send-analog-error',
      'send-analog-error-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', }
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - failure - multi recipient 0', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.KO;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFnMulti0(
      'send-analog-error',
      'send-analog-error-description-multirecipient',
      { name: 'Lorenza Catrufizzio', taxId: '(mocked-taxId)', }
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - success - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.OK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFnSingle(
      'send-analog-success',
      'send-analog-success-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', }
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - success - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.OK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    testTimelineStatusInfosFnMulti1(
      'send-analog-success',
      'send-analog-success-description-multirecipient',
      { name: `Catena Dall'Olio`, taxId: '(mocked-taxId2)', }
    );
  });

  // // PN-1647
  it('return timeline status infos - NOT_HANDLED', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOT_HANDLED;
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reasonCode = '001';
    (parsedNotificationCopy.timeline[0].details as NotHandledDetails).reason =
      'Paper message not handled';
    const { label, description } = getNotificationTimelineStatusInfos(
      parsedNotificationCopy.timeline[0],
      parsedNotificationCopy.recipients
    ) as { label: string; description: string };
    expect(label).toEqual('Annullata');
    expect(description).toEqual(
      'La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.'
    );
  });
});

describe.skip('parse notification & filters', () => {
  it('return parsed notification detail response', () => {
    const calculatedParsedNotification = parseNotificationDetail(notificationFromBe);
    expect(calculatedParsedNotification).toStrictEqual(parsedNotification);
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

describe.skip('timeline legal fact link text', () => {
  it('return legalFact label - default', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.GET_ADDRESS;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('detail.legalfact');
  });

  it('return legalFact label - SEND_ANALOG_FEEDBACK (success)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.OK;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.paper-receipt-delivered');
  });

  it('return legalFact label - SEND_ANALOG_FEEDBACK (failure)', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).responseStatus =
      ResponseStatus.KO;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.paper-receipt-not-delivered');
  });

  it('return legalFact label - SEND_ANALOG_PROGRESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.paper-receipt-accepted');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (success) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C001';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.pec-receipt-accepted');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (failure) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).eventCode = 'C008';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.pec-receipt-not-accepted');
  });

  it('return legalFact label - SEND_DIGITAL_FEEDBACK (success) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'OK';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.pec-receipt-delivered');
  });

  it('return legalFact label - SEND_DIGITAL_FEEDBACK (failure) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).responseStatus = 'KO';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.pec-receipt-not-delivered');
  });

  it('return legalFact label - REQUEST_ACCEPTED - SENDER_ACK', () => {
    // In fact the timeline event category is not explicitly checked.
    // In the examples I've seen, such legal facts are associated to REQUEST_ACCEPTED events.
    // I set the category to avoid the scenario to be "caught up" by previous cases in the 
    // legal fact switch, which check the timeline event category only.
    // ------------------------------------
    // Carlos Lombardi, 2023.02.28
    // ------------------------------------
    parsedNotificationCopy.timeline[0].category = TimelineCategory.REQUEST_ACCEPTED;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.SENDER_ACK);
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.sender-ack');
  });

  it('return legalFact label - DIGITAL_SUCCESS_WORKFLOW - DIGITAL_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_SUCCESS_WORKFLOW;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.DIGITAL_DELIVERY);
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.digital-delivery-success');
  });

  it('return legalFact label - DIGITAL_FAILURE_WORKFLOW - DIGITAL_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.DIGITAL_DELIVERY);
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.digital-delivery-failure');
  });

  // Similar to the SENDER_ACK case above, in this case the timeline event category
  // associated but not explicitly verified in the code is NOTIFICATION_VIEWED
  // ------------------------------------
  // Carlos Lombardi, 2023.02.28
  // ------------------------------------
  it('return legalFact label - NOTIFICATION_VIEWED - RECIPIENT_ACCESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOTIFICATION_VIEWED;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.RECIPIENT_ACCESS);
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.recipient-access');
  });

});
