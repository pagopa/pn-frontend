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
  NotificationStatusHistory,
  NotificationDetailRecipient,
  NotificationDetail,
  NotificationDeliveryMode,
  ResponseStatus,
  INotificationDetailTimeline,
  DigitalWorkflowDetails,
  RecipientType,
} from '../../types';
import { AppIoCourtesyMessageEventType, NotificationDetailOtherDocument } from '../../types/NotificationDetail';
import { formatToTimezoneString, getNextDay } from '../date.utility';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  parseNotificationDetail,
} from '../notification.utility';
import {
  acceptedDeliveringDeliveredTimeline,
  acceptedDeliveringDeliveredTimelineStatusHistory,
  additionalRecipient,
  analogFailureStatusHistory,
  analogFailureTimeline,
  notificationFromBe,
  parsedNotification,
  parsedNotificationTwoRecipients,
} from './test-utils';

jest.mock('../../services/localization.service', () => {
  const original = jest.requireActual('../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_1: string, key: string, _2: string, data: any) => {
      // Ad-hoc handling of a particular case: in order to generate the description for the
      // VIEWED statuses, if the notification has been viewed by a delegate,
      // a previous i18n call allows to obtain the text that refers to the delegate,
      // and then the obtained value is passed as a data item (say "recipient") to the "main" i18n call.
      // But in turn, the first i18n call has also data passed, namely the name of the delegate.
      // Hence in this mock we would arrive to something like
      // 'mainKey /-/ { recipient: status.delegate /-/ {name: Some Name} }'
      // which is difficult to parse.
      // Then for the first i18n call in this case, whose key is status.delgate,
      // we give instead 'status.delegate.Some Name' as the output, so that the final i18n expression
      // is 'mainKey /-/ { recipient: status.delegate.Some Name }'
      // which can be handled through the general procedure and is easy to expect about.
      if (key === 'status.delegate' && data && data.name) {
        return `status.delegate.${data.name}`;
      } else {
        // just separate key and data with a unique pattern
        // so that they can be split for the expectations.
        // The data is re-converted into JSON in order to ease the specification of the expected result.
        return data ? `${key} /-/ ${JSON.stringify(data)}` : key;
      }
    },
  };
});

let parsedNotificationCopy = _.cloneDeep(parsedNotification);
let parsedNotificationTwoRecipientsCopy = _.cloneDeep(parsedNotificationTwoRecipients);

function testNotificationStatusInfosFnIncludingDescription(
  status: NotificationStatusHistory | NotificationStatus,
  recipients: Array<NotificationDetailRecipient | string> | undefined,
  labelToTest: string,
  colorToTest: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary',
  tooltipToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any
) {
  const { label, color, tooltip, description } = recipients
    ? getNotificationStatusInfos(status, { recipients })
    : getNotificationStatusInfos(status);
  expect(label).toBe(labelToTest);
  expect(color).toBe(colorToTest);
  if (description.indexOf(' /-/ ') > -1) {
    const [bareDescription, descriptionDataAsString] = description.split(' /-/ ');
    const bareTooltip = tooltip.split(' /-/ ')[0];
    expect(bareTooltip).toBe(tooltipToTest);
    expect(bareDescription).toBe(descriptionToTest);
    expect(JSON.parse(descriptionDataAsString)).toEqual(descriptionDataToTest);
  } else {
    expect(tooltip).toBe(tooltipToTest);
    expect(description).toBe(descriptionToTest);
  }
}

function testTimelineStatusInfosFn(
  notification: NotificationDetail,
  timelineIndex: number,
  labelToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
) {
  const { label, description } = getNotificationTimelineStatusInfos(
    notification.timeline[timelineIndex],
    notification.recipients,
    allStepsForThisStatus
  ) as { label: string; description: string };
  expect(label).toBe(`detail.timeline.${labelToTest}`);
  if (description.indexOf(' /-/ ') > -1) {
    const [bareDescription, descriptionDataAsString] = description.split(' /-/ ');
    expect(bareDescription).toBe(`detail.timeline.${descriptionToTest}`);
    expect(JSON.parse(descriptionDataAsString)).toEqual(descriptionDataToTest);
  } else {
    expect(description).toBe(`detail.timeline.${descriptionToTest}`);
  }
}

function testTimelineStatusInfosFnSingle(
  labelToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
) {
  testTimelineStatusInfosFn(
    parsedNotificationCopy,
    0,
    labelToTest,
    descriptionToTest,
    descriptionDataToTest,
    allStepsForThisStatus
  );
}

function testTimelineStatusInfosFnMulti0(
  labelToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
) {
  testTimelineStatusInfosFn(
    parsedNotificationTwoRecipientsCopy,
    0,
    labelToTest,
    descriptionToTest,
    descriptionDataToTest,
    allStepsForThisStatus
  );
}

function testTimelineStatusInfosFnMulti1(
  labelToTest: string,
  descriptionToTest: string,
  descriptionDataToTest?: any,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
) {
  parsedNotificationTwoRecipientsCopy.timeline[0].details.recIndex = 1;
  testTimelineStatusInfosFn(
    parsedNotificationTwoRecipientsCopy,
    0,
    labelToTest,
    descriptionToTest,
    descriptionDataToTest,
    allStepsForThisStatus
  );
}

function sendAnalogDomicileStep(registeredLetterKind = 'AR') {
  return {
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    elementId: 'SEND_ANALOG_DOMICILE_0',
    timestamp: '2023-01-01',
    details: {
      recIndex: 0,
      productType: registeredLetterKind
    }
  };
}

describe('notification status texts', () => {
  it('return notification status infos - DELIVERED - single recipient - analog shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.ANALOG,
      },
      ['single-recipient'],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description-with-delivery-mode',
      { deliveryMode: 'status.deliveryMode.analog' }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - digital shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      },
      ['single-recipient'],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description-with-delivery-mode',
      { deliveryMode: 'status.deliveryMode.digital' }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - no delivery mode specified', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['single-recipient'],
      'status.delivered',
      'default',
      'status.delivered-tooltip',
      'status.delivered-description'
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - analog shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.ANALOG,
      },
      ['recipient-1', 'recipient-2'],
      'status.delivered-multirecipient',
      'default',
      'status.delivered-tooltip-multirecipient',
      'status.delivered-description-multirecipient'
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - digital shipment', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      },
      ['recipient-1', 'recipient-2'],
      'status.delivered-multirecipient',
      'default',
      'status.delivered-tooltip-multirecipient',
      'status.delivered-description-multirecipient'
    );
  });

  it('return notification status infos - DELIVERING', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.DELIVERING,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['single-recipient'],
      'status.delivering',
      'default',
      'status.delivering-tooltip',
      'status.delivering-description'
    );
  });

  it('return notification status infos - DELIVERING - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.DELIVERING,
      undefined,
      'status.delivering',
      'default',
      'status.delivering-tooltip',
      'status.delivering-description'
    );
  });

  it('return notification status infos - UNREACHABLE - single recipient - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.UNREACHABLE,
      ['single-recipient'],
      'status.unreachable',
      'error',
      'status.unreachable-tooltip',
      'status.unreachable-description'
    );
  });

  it('return notification status infos - UNREACHABLE - multi recipient - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.UNREACHABLE,
      ['recipient-1', 'recipient-2'],
      'status.unreachable-multirecipient',
      'error',
      'status.unreachable-tooltip-multirecipient',
      'status.unreachable-description-multirecipient'
    );
  });

  it('return notification status infos - PAID - passing the status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.PAID,
      undefined,
      'status.paid',
      'success',
      'status.paid-tooltip',
      'status.paid-description'
    );
  });

  it('return notification status infos - ACCEPTED', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.ACCEPTED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      undefined,
      'status.accepted',
      'default',
      'status.accepted-tooltip',
      'status.accepted-description'
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - single recipient', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.EFFECTIVE_DATE,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['single-recipient'],
      'status.effective-date',
      'info',
      'status.effective-date-tooltip',
      'status.effective-date-description'
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - multi recipient', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.EFFECTIVE_DATE,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['recipient-1', 'recipient-2'],
      'status.effective-date-multirecipient',
      'info',
      'status.effective-date-tooltip-multirecipient',
      'status.effective-date-description-multirecipient'
    );
  });

  it('return notification status infos - VIEWED - single recipient - no delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['single-recipient'],
      'status.viewed',
      'success',
      'status.viewed-tooltip',
      'status.viewed-description',
      { subject: 'status.recipient' }
    );
  });

  it('return notification status infos - VIEWED - single recipient - including delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        recipient: 'Mario Rossi',
      },
      ['single-recipient'],
      'status.viewed',
      'success',
      'status.viewed-tooltip',
      'status.viewed-description',
      { subject: 'status.delegate.Mario Rossi' }
    );
  });

  it('return notification status infos - VIEWED - multi recipient - no delegate (named as "recipient") info', () => {
    testNotificationStatusInfosFnIncludingDescription(
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      ['recipient-1', 'recipient-2'],
      'status.viewed-multirecipient',
      'success',
      'status.viewed-tooltip-multirecipient',
      'status.viewed-description-multirecipient',
      { subject: 'status.recipient' }
    );
  });

  it('return notification status infos - CANCELLED - passing status only', () => {
    testNotificationStatusInfosFnIncludingDescription(
      NotificationStatus.CANCELLED,
      undefined,
      'status.canceled',
      'warning',
      'status.canceled-tooltip',
      'status.canceled-description'
    );
  });
});

describe('timeline event description', () => {
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
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFnMulti0(
      'schedule-digital-workflow',
      'schedule-digital-workflow-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)' }
    );
  });

  it('return timeline status infos - SCHEDULE_DIGITAL_WORKFLOW - multirecipient - recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW;
    testTimelineStatusInfosFnMulti1(
      'schedule-digital-workflow',
      'schedule-digital-workflow-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)' }
    );
  });

  it('return timeline status infos - ANALOG_FAILURE_WORKFLOW - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.ANALOG_FAILURE_WORKFLOW;
    testTimelineStatusInfosFnSingle(
      'analog-failure-workflow',
      'analog-failure-workflow-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)' }
    );
  });

  it('return timeline status infos - ANALOG_FAILURE_WORKFLOW - multirecipient - recipient 0', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.ANALOG_FAILURE_WORKFLOW;
    testTimelineStatusInfosFnMulti0(
      'analog-failure-workflow',
      'analog-failure-workflow-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)' }
    );
  });

  it('return timeline status infos - ANALOG_FAILURE_WORKFLOW - multirecipient - recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.ANALOG_FAILURE_WORKFLOW;
    testTimelineStatusInfosFnMulti1(
      'analog-failure-workflow',
      'analog-failure-workflow-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)' }
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - single recipient - email', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_COURTESY_MESSAGE;
    (parsedNotificationCopy.timeline[0].details as SendCourtesyMessageDetails).digitalAddress = {
      type: DigitalDomicileType.EMAIL,
      address: 'nome@cognome.mail',
    };
    testTimelineStatusInfosFnSingle('send-courtesy-message', 'send-courtesy-message-description', {
      name: 'Nome Cognome',
      taxId: '(mocked-taxId)',
      type: 'email',
    });
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - multi recipient 0 - sms', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_COURTESY_MESSAGE;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as SendCourtesyMessageDetails
    ).digitalAddress = {
      type: DigitalDomicileType.SMS,
      address: '+393334445566',
    };
    testTimelineStatusInfosFnMulti0(
      'send-courtesy-message',
      'send-courtesy-message-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', type: 'sms' }
    );
  });

  it('return timeline status infos - SEND_COURTESY_MESSAGE - multi recipient 1 - app IO', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_COURTESY_MESSAGE;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as SendCourtesyMessageDetails
    ).digitalAddress = {
      type: DigitalDomicileType.APPIO,
      address: '+393334445566',
    };
    testTimelineStatusInfosFnMulti1(
      'send-courtesy-message',
      'send-courtesy-message-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', type: 'app IO' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_DOMICILE;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).digitalAddress = {
      type: DigitalDomicileType.PEC,
      address: 'toto86@cognome.mail',
    };
    testTimelineStatusInfosFnSingle('send-digital-domicile', 'send-digital-domicile-description', {
      name: 'Nome Cognome',
      taxId: '(mocked-taxId)',
      address: 'toto86@cognome.mail',
    });
  });

  it('return timeline status infos - SEND_DIGITAL_DOMICILE - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_DIGITAL_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress =
      {
        type: DigitalDomicileType.PEC,
        address: 'toto86@cognome.mail',
      };
    testTimelineStatusInfosFnMulti1(
      'send-digital-domicile',
      'send-digital-domicile-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: 'toto86@cognome.mail' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - failure - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).deliveryDetailCode = 'C008';
    testTimelineStatusInfosFnSingle(
      'send-digital-progress-error',
      'send-digital-progress-error-description',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: 'nome@cognome.mail' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_PROGRESS - failure - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_DIGITAL_PROGRESS;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails
    ).deliveryDetailCode = 'C010';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress =
      {
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
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).deliveryDetailCode = 'C001';
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
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_DIGITAL_PROGRESS;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails
    ).deliveryDetailCode = 'DP00';
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
    testTimelineStatusInfosFnSingle('send-digital-error', 'send-digital-error-description', {
      name: 'Nome Cognome',
      taxId: '(mocked-taxId)',
      address: 'nome.altronome@cognome.mail',
    });
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK - success - multirecipient 0', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).responseStatus =
      'OK';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress =
      {
        type: DigitalDomicileType.PEC,
        address: 'nome0@cognome.mail',
      };
    testTimelineStatusInfosFnMulti0(
      'send-digital-success',
      'send-digital-success-description-multirecipient',
      { name: 'Nome Cognome', taxId: '(mocked-taxId)', address: 'nome0@cognome.mail' }
    );
  });

  it('return timeline status infos - SEND_DIGITAL_FEEDBACK - success - multirecipient 1', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_DIGITAL_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).responseStatus =
      'OK';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendDigitalDetails).digitalAddress =
      {
        type: DigitalDomicileType.PEC,
        address: 'nome0@cognome.mail',
      };
    testTimelineStatusInfosFnMulti1(
      'send-digital-success',
      'send-digital-success-description-multirecipient',
      { name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', address: 'nome0@cognome.mail' }
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
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        address: 'Via Mazzini 1848 - Graniti (98036)',
        simpleAddress: 'Via Mazzini 1848',
      }
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER - multi recipient 0 - just bare address', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as AnalogWorkflowDetails
    ).physicalAddress = {
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
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        address: 'Via Roma 135',
        simpleAddress: 'Via Roma 135',
      }
    );
  });

  it('return timeline status infos - SEND_SIMPLE_REGISTERED_LETTER - multi recipient 1 - no address at all', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    (
      parsedNotificationTwoRecipientsCopy.timeline[0].details as AnalogWorkflowDetails
    ).physicalAddress = {
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
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        address: 'Via Manganelli 1',
        simpleAddress: 'Via Manganelli 1',
      }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - 890 - multi recipient 1 - full address', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.REGISTERED_LETTER_890;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress =
      {
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
      {
        name: `Catena Dall'Olio`,
        taxId: '(mocked-taxId2)',
        address: 'Via Manganelli 1 - Francavilla di Sicilia (98030)',
        simpleAddress: 'Via Manganelli 1',
      }
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
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        address: 'Via Umberto 45 - Motta Camastra (98035) Italia',
        simpleAddress: 'Via Umberto 45',
      }
    );
  });

  it('return timeline status infos - SEND_ANALOG_DOMICILE - A/R - multi recipient 0 - bare address', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_ANALOG_DOMICILE;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).serviceLevel =
      PhysicalCommunicationType.AR_REGISTERED_LETTER;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress =
      {
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
      {
        name: 'Lorenza Catrufizzio',
        taxId: '(mocked-taxId)',
        address: 'Via Manganelli 1',
        simpleAddress: 'Via Manganelli 1',
      }
    );
  });

  it('return timeline status infos - SEND_ANALOG_PROGRESS - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'CON080';
    testTimelineStatusInfosFnSingle(
      'send-analog-progress', 
      'send-analog-flow-CON080-description', 
      { 
        name: 'Nome Cognome', taxId: '(mocked-taxId)', 
        registeredLetterKind: ' detail.timeline.registered-letter-kind.AR',
        deliveryFailureCause: '',
        registeredLetterNumber: ''
      }, 
      [sendAnalogDomicileStep()]
    );
  });

  it('return timeline status infos - SEND_ANALOG_PROGRESS - multi recipient', () => {
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_ANALOG_PROGRESS;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'CON080';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).registeredLetterCode = 'RACC-034-B93';
    testTimelineStatusInfosFnMulti1(
      'send-analog-progress',
      'send-analog-flow-CON080-description-multirecipient',
      { 
        name: 'Nome2 Cognome2', taxId: '(mocked-taxId2)', 
        registeredLetterKind: ' detail.timeline.registered-letter-kind.AR',
        deliveryFailureCause: '',
        registeredLetterNumber: 'RACC-034-B93'
      },
      [sendAnalogDomicileStep()]
    );
  });

  it(`return timeline status infos - SEND_ANALOG_PROGRESS - failure code - single recipient`, () => {
    const mockDetailCode = 'mock-detail-code';
    const mockFailureCode = 'mock-failure-code';
    const mockLetterNumber = 'mock-letter-number';
    
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;

    (parsedNotificationCopy.timeline[0].details as SendPaperDetails) = {
      ...(parsedNotificationCopy.timeline[0].details as SendPaperDetails),
      deliveryDetailCode: mockDetailCode,
      deliveryFailureCause: mockFailureCode,
      registeredLetterCode: mockLetterNumber
    };

    testTimelineStatusInfosFnSingle(
      'send-analog-progress',
      `send-analog-flow-${mockDetailCode}-description`,
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        deliveryFailureCause: `detail.timeline.analog-workflow-failure-cause.${mockFailureCode}`,
        registeredLetterKind: '',
        registeredLetterNumber: mockLetterNumber,
      }
    );
  });

  it(`return timeline status infos - SEND_ANALOG_FEEDBACK - failure code - single recipient`, () => {
    const mockFailureCode = 'mock-failure-code';
    const mockLetterNumber = 'mock-letter-number';
    
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails) = {
      ...(parsedNotificationCopy.timeline[0].details as SendPaperDetails),
      deliveryDetailCode: 'RECAG003C',
      deliveryFailureCause: mockFailureCode,
      registeredLetterCode: mockLetterNumber
    };

    testTimelineStatusInfosFnSingle(
      'send-analog-error',
      `send-analog-flow-RECAG003C-description`,
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        deliveryFailureCause: `detail.timeline.analog-workflow-failure-cause.${mockFailureCode}`,
        registeredLetterKind: '',
        registeredLetterNumber: mockLetterNumber,
      }
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - failure - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'RECRN002C';
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).deliveryFailureCause = 'M08';
    testTimelineStatusInfosFnSingle('send-analog-error', 'send-analog-flow-RECRN002C-description', 
      {
        name: 'Nome Cognome', taxId: '(mocked-taxId)',
        registeredLetterKind: ' detail.timeline.registered-letter-kind.RIR',
        deliveryFailureCause: 'detail.timeline.analog-workflow-failure-cause.M08',
        registeredLetterNumber: ''
      }, 
      [sendAnalogDomicileStep("RIR")]
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - failure - multi recipient 0', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress =
      {
        address: 'Indirizzo fisico',
        zip: 'zip',
        municipality: 'municipality',
      };
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'RECRN002F';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).deliveryFailureCause = 'M03';
    testTimelineStatusInfosFnMulti0(
      'send-analog-error',
      'send-analog-flow-RECRN002F-description-multirecipient',
      { 
        name: 'Lorenza Catrufizzio', taxId: '(mocked-taxId)',
        registeredLetterKind: ' detail.timeline.registered-letter-kind.890',
        deliveryFailureCause: 'detail.timeline.analog-workflow-failure-cause.M03',
        registeredLetterNumber: ''
      },
      [sendAnalogDomicileStep("890")]
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - success - single recipient', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).physicalAddress = {
      address: 'Indirizzo fisico',
      zip: 'zip',
      municipality: 'municipality',
    };
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'RECAG001C';
    (parsedNotificationCopy.timeline[0].details as SendPaperDetails).deliveryFailureCause = '';
    testTimelineStatusInfosFnSingle('send-analog-success', 'send-analog-flow-RECAG001C-description', 
      {
        name: 'Nome Cognome',
        taxId: '(mocked-taxId)',
        registeredLetterKind: ' detail.timeline.registered-letter-kind.AR',
        deliveryFailureCause: '',
        registeredLetterNumber: ''
      },
      [sendAnalogDomicileStep()]
    );
  });

  it('return timeline status infos - SEND_ANALOG_FEEDBACK - success - multi recipient 1', () => {
    parsedNotificationTwoRecipientsCopy.recipients[0].denomination = 'Lorenza Catrufizzio';
    parsedNotificationTwoRecipientsCopy.recipients[1].denomination = `Catena Dall'Olio`;
    parsedNotificationTwoRecipientsCopy.timeline[0].category =
      TimelineCategory.SEND_ANALOG_FEEDBACK;
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).physicalAddress =
      {
        address: 'Indirizzo fisico',
        zip: 'zip',
        municipality: 'municipality',
      };
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).sendRequestId = 'SEND_ANALOG_DOMICILE_0';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).deliveryDetailCode = 'RECRN003C';
    (parsedNotificationTwoRecipientsCopy.timeline[0].details as SendPaperDetails).deliveryFailureCause = '';
    testTimelineStatusInfosFnMulti1(
      'send-analog-success',
      'send-analog-flow-RECRN003C-description-multirecipient',
      { 
        name: `Catena Dall'Olio`, taxId: '(mocked-taxId2)',
        registeredLetterKind: ' detail.timeline.registered-letter-kind.AR',
        deliveryFailureCause: '',
        registeredLetterNumber: ''
      },
      [sendAnalogDomicileStep()]
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

describe('parse notification & filters', () => {
  let sourceNotification: NotificationDetail;

  beforeEach(() => {
    sourceNotification = { ...notificationFromBe };
  });

  it('return parsed notification detail response', () => {
    const calculatedParsedNotification = parseNotificationDetail(sourceNotification);
    expect(calculatedParsedNotification).toStrictEqual(parsedNotification);
  });

  it('reverse status and events - some hidden status', () => {
    // inject an initial, hidden event for the DELIVERING status
    const injectedFirstDeliveringEvent: INotificationDetailTimeline = {
      elementId: 'public-registry-call',
      timestamp: '2023-01-26T13:55:57.651901435Z',
      category: TimelineCategory.PUBLIC_REGISTRY_CALL,
      details: {},
    };
    const timeline = acceptedDeliveringDeliveredTimeline();
    timeline.splice(2, 0, injectedFirstDeliveringEvent);
    sourceNotification.timeline = timeline;
    const statusHistory = acceptedDeliveringDeliveredTimelineStatusHistory();
    statusHistory[1].relatedTimelineElements.unshift('public-registry-call');
    sourceNotification.notificationStatusHistory = statusHistory;

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    // statuses
    expect(parsedNotification.notificationStatusHistory).toHaveLength(3);
    expect(parsedNotification.notificationStatusHistory[0].status).toEqual(
      NotificationStatus.DELIVERED
    );
    expect(parsedNotification.notificationStatusHistory[1].status).toEqual(
      NotificationStatus.DELIVERING
    );
    expect(parsedNotification.notificationStatusHistory[2].status).toEqual(
      NotificationStatus.ACCEPTED
    );
    // DELIVERED events
    let currentSteps = parsedNotification.notificationStatusHistory[0].steps;
    expect(currentSteps).toHaveLength(2);
    expect(currentSteps && currentSteps[0].category).toEqual(TimelineCategory.SCHEDULE_REFINEMENT);
    expect(currentSteps && currentSteps[0].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[1].category).toEqual(
      TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    expect(currentSteps && currentSteps[1].hidden).toBeTruthy();
    // DELIVERING events -- ACCEPTED events are copied
    // hidden status of copied events is checked in a separate test
    currentSteps = parsedNotification.notificationStatusHistory[1].steps;
    expect(currentSteps).toHaveLength(6);
    expect(currentSteps && currentSteps[0].category).toEqual(
      TimelineCategory.SEND_DIGITAL_FEEDBACK
    );
    expect(currentSteps && currentSteps[0].hidden).toBeFalsy();
    expect(currentSteps && currentSteps[1].category).toEqual(
      TimelineCategory.SEND_DIGITAL_PROGRESS
    );
    expect(currentSteps && currentSteps[1].hidden).toBeFalsy();
    expect(currentSteps && currentSteps[2].category).toEqual(
      TimelineCategory.SEND_DIGITAL_DOMICILE
    );
    expect(currentSteps && currentSteps[2].hidden).toBeFalsy();
    expect(currentSteps && currentSteps[3].category).toEqual(TimelineCategory.PUBLIC_REGISTRY_CALL);
    expect(currentSteps && currentSteps[3].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[4].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(currentSteps && currentSteps[5].category).toEqual(TimelineCategory.REQUEST_ACCEPTED);
    // ACCEPTED events
    // hidden status is checked in a separate test
    currentSteps = parsedNotification.notificationStatusHistory[2].steps;
    expect(currentSteps).toHaveLength(2);
    expect(currentSteps && currentSteps[0].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(currentSteps && currentSteps[1].category).toEqual(TimelineCategory.REQUEST_ACCEPTED);
  });

  it('reverse status and events - simultaneous events', () => {
    const timeline = acceptedDeliveringDeliveredTimeline();
    const timelineElementToBeClonedIndex = timeline.findIndex(elem => elem.elementId === 'digital_progress_0_PLATFORM');
    if (timelineElementToBeClonedIndex === -1) {
      fail('cannot build the test scenario');
    }
    const timelineElementToBeCloned = timeline[timelineElementToBeClonedIndex];
    const newTimelineElement = {...timelineElementToBeCloned, elementId: 'digital_progress_1_PLATFORM'};
    (newTimelineElement.details as SendDigitalDetails).deliveryDetailCode = 'C002';
    newTimelineElement.timestamp = timeline[timelineElementToBeClonedIndex+1].timestamp;
    timeline.splice(timelineElementToBeClonedIndex+1, 0, newTimelineElement);
    sourceNotification.timeline = timeline;
    const statusHistory = acceptedDeliveringDeliveredTimelineStatusHistory();
    const deliveringStatus = statusHistory.find(status => status.status === NotificationStatus.DELIVERING);
    if (!deliveringStatus) {
      fail('cannot build the test scenario');
    }
    const insertionIndex = deliveringStatus.relatedTimelineElements.findIndex(elem => elem === 'digital_progress_0_PLATFORM') + 1;
    deliveringStatus?.relatedTimelineElements.splice(insertionIndex, 0, 'digital_progress_1_PLATFORM');
    sourceNotification.notificationStatusHistory = statusHistory;

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    // DELIVERING events -- FEEDBACK comes before both PROGRESS
    let currentSteps = parsedNotification.notificationStatusHistory[1].steps;
    expect(currentSteps && currentSteps[0].category).toEqual(
      TimelineCategory.SEND_DIGITAL_FEEDBACK
    );
    expect(currentSteps && currentSteps[1].category).toEqual(
      TimelineCategory.SEND_DIGITAL_PROGRESS
    );
    expect(currentSteps && currentSteps[1].elementId).toEqual(
      'digital_progress_1_PLATFORM'
    );
    expect(currentSteps && currentSteps[1].timestamp).toEqual(
      currentSteps && currentSteps[0].timestamp
    );
    expect(currentSteps && currentSteps[2].category).toEqual(
      TimelineCategory.SEND_DIGITAL_PROGRESS
    );
    expect(currentSteps && currentSteps[2].elementId).toEqual(
      'digital_progress_0_PLATFORM'
    );
    expect(currentSteps && currentSteps[2].timestamp).not.toEqual(
      currentSteps && currentSteps[0].timestamp
    );
  });

  it('duplicates ACCEPTED events - hidden copies', () => {
    sourceNotification.timeline = acceptedDeliveringDeliveredTimeline();
    sourceNotification.notificationStatusHistory =
      acceptedDeliveringDeliveredTimelineStatusHistory();
    const parsedNotification = parseNotificationDetail(sourceNotification);
    // DELIVERING events -- ACCEPTED events are copied at the end
    let currentSteps = parsedNotification.notificationStatusHistory[1].steps;
    expect(currentSteps).toHaveLength(5);
    expect(currentSteps && currentSteps[3].hidden).toBeFalsy();
    // the REQUEST_ACCEPTED step is always hidden
    expect(currentSteps && currentSteps[4].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[4].legalFactsIds).toHaveLength(0);
    // ACCEPTED events
    currentSteps = parsedNotification.notificationStatusHistory[2].steps;
    expect(currentSteps).toHaveLength(2);
    expect(currentSteps && currentSteps[0].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[1].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[1].legalFactsIds).toHaveLength(1);
  });

  it('OPTIN-related AppIO courtesy-message-send events should be hidden', () => {
    const timeline = acceptedDeliveringDeliveredTimeline();

    // add several SEND_COURTESY_MESSAGE
    const courtesyIOOptinEvent: INotificationDetailTimeline = {
      elementId: 'send_courtesy_message_appio_optin',
      timestamp: '2023-01-26T13:55:53.597019182Z',
      category: TimelineCategory.SEND_COURTESY_MESSAGE,
      details: {
        recIndex: 0,
        sendDate: 'some-date-optin',
        digitalAddress: { type: DigitalDomicileType.APPIO, address: 'some-user-appio' },
        ioSendMessageResult: AppIoCourtesyMessageEventType.SENT_OPTIN,
      },
    };
    const courtesyIOActualSendEvent: INotificationDetailTimeline = {
      elementId: 'send_courtesy_message_appio_actual_send',
      timestamp: '2023-01-26T13:55:54.597019182Z',
      category: TimelineCategory.SEND_COURTESY_MESSAGE,
      details: {
        recIndex: 0,
        sendDate: 'some-date-actual_appio_send',
        digitalAddress: { type: DigitalDomicileType.APPIO, address: 'some-user-appio' },
        ioSendMessageResult: AppIoCourtesyMessageEventType.SENT_COURTESY,
      },
    };
    timeline.splice(2, 0, courtesyIOOptinEvent, courtesyIOActualSendEvent);

    // set the modified timeline
    sourceNotification.timeline = timeline;

    // change the status history accordingly
    const history = acceptedDeliveringDeliveredTimelineStatusHistory();
    // ACCEPTED is the first status, the additional SEND_COURTESY_MESSAGE events are to be added at the end.
    history[0].relatedTimelineElements.push(
      courtesyIOOptinEvent.elementId,
      courtesyIOActualSendEvent.elementId
    );
    sourceNotification.notificationStatusHistory = history;

    // now the test
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // in fact I must verify in the DELIVERING copied events, since *all* the ACCEPTED events are hidden

    // DELIVERING is the intermediate (i.e. second) status
    let currentSteps = parsedNotification.notificationStatusHistory[1].steps;
    expect(currentSteps).toHaveLength(7);
    // fourth-to-last, i.e. fourth (of seven) step is the SENT_COURTESY - not hidden
    // the three latter steps are the "original" DELIVERY steps
    expect(currentSteps && currentSteps[3].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(
      currentSteps && (currentSteps[3].details as SendCourtesyMessageDetails).digitalAddress?.type
    ).toEqual(DigitalDomicileType.APPIO);
    expect(
      currentSteps && (currentSteps[3].details as SendCourtesyMessageDetails).ioSendMessageResult
    ).toEqual(AppIoCourtesyMessageEventType.SENT_COURTESY);
    expect(currentSteps && currentSteps[3].hidden).toBeFalsy();
    // third-to-last, i.e. fifth, step is the SENT_OPTIN - hidden
    expect(currentSteps && currentSteps[4].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(
      currentSteps && (currentSteps[4].details as SendCourtesyMessageDetails).digitalAddress?.type
    ).toEqual(DigitalDomicileType.APPIO);
    expect(
      currentSteps && (currentSteps[4].details as SendCourtesyMessageDetails).ioSendMessageResult
    ).toEqual(AppIoCourtesyMessageEventType.SENT_OPTIN);
    expect(currentSteps && currentSteps[4].hidden).toBeTruthy();
    // second-to-last, i.e. sixth step is a courtesy message sent through email - not hidden
    expect(currentSteps && currentSteps[5].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(
      currentSteps && (currentSteps[5].details as SendCourtesyMessageDetails).digitalAddress?.type
    ).toEqual(DigitalDomicileType.EMAIL);
    expect(currentSteps && currentSteps[5].hidden).toBeFalsy();
    // last, i.e. seventh step is REQUEST_ACEPTED - always hidden
    expect(currentSteps && currentSteps[6].category).toEqual(TimelineCategory.REQUEST_ACCEPTED);
    expect(currentSteps && currentSteps[6].hidden).toBeTruthy();
  });

  it('deliveryMode DIGITAL', () => {
    sourceNotification.timeline = acceptedDeliveringDeliveredTimeline();
    sourceNotification.notificationStatusHistory =
      acceptedDeliveringDeliveredTimelineStatusHistory();
    // the "base" mocked notification corresponds to the DIGITAL workflow
    const parsedNotification = parseNotificationDetail(sourceNotification);
    // the first status is DELIVERED
    expect(parsedNotification.notificationStatusHistory[0].deliveryMode).toEqual(
      NotificationDeliveryMode.DIGITAL
    );
  });

  it('deliveryMode ANALOG', () => {
    // change the category of the DIGITAL_SUCCESS_WORKFLOW timeline event to SEND_SIMPLE_REGISTERED_LETTER
    const timeline = acceptedDeliveringDeliveredTimeline();
    const indexToUpdate = timeline.findIndex(
      (elem) => elem.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    timeline[indexToUpdate].category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    timeline[indexToUpdate].elementId = 'send-simple-registered-letter-0';
    timeline[indexToUpdate].details = {
      recIndex: 0,
      productType: 'RN_RS',
      physicalAddress: { address: 'Via Rosas 1829', zip: '98036', municipality: 'Graniti' },
    };
    sourceNotification.timeline = timeline;
    // also from status history
    const history = acceptedDeliveringDeliveredTimelineStatusHistory();
    // DELIVERED is the last status, the currently DIGITAL_SUCCESS_WORKFLOW its first element.
    history[2].relatedTimelineElements[0] = 'send-simple-registered-letter-0';
    sourceNotification.notificationStatusHistory = history;

    // now the test
    const parsedNotification = parseNotificationDetail(sourceNotification);
    // the first status is DELIVERED
    expect(parsedNotification.notificationStatusHistory[0].deliveryMode).toEqual(
      NotificationDeliveryMode.ANALOG
    );
  });

  it('deliveryMode not assigned', () => {
    // remove the DIGITAL_SUCCESS_WORKFLOW timeline event
    const timeline = acceptedDeliveringDeliveredTimeline();
    const indexToRemove = timeline.findIndex(
      (elem) => elem.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    timeline.splice(indexToRemove, 1);
    sourceNotification.timeline = timeline;
    // also from status history
    const history = acceptedDeliveringDeliveredTimelineStatusHistory();
    // DELIVERED is the first status, DIGITAL_SUCCESS_WORKFLOW its first element.
    history[0].relatedTimelineElements.splice(0, 0);
    sourceNotification.notificationStatusHistory = history;

    // now the test
    const parsedNotification = parseNotificationDetail(sourceNotification);
    // the first status is DELIVERED
    expect(parsedNotification.notificationStatusHistory[0].deliveryMode).toBeFalsy();
  });

  it('shift steps from DELIVERED to DELIVERING', () => {
    const timeline = acceptedDeliveringDeliveredTimeline();

    // change the category of the DIGITAL_SUCCESS_WORKFLOW timeline event to DIGITAL_FAILURE_WORKFLOW
    const indexToUpdate = timeline.findIndex(
      (elem) => elem.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    timeline[indexToUpdate].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    timeline[indexToUpdate].elementId = 'digital-failure-workflow';
    timeline[indexToUpdate].details = { recIndex: 0 };

    // add PREPARE_SIMPLE_REGISTERED_LETTER / SEND_SIMPLE_REGISTERED_LETTER / SEND_COURTESY_MESSAGE
    const prepareEvent: INotificationDetailTimeline = {
      elementId: 'prepare-simple-registered-letter-0',
      timestamp: '2023-01-26T14:17:20.525827086Z',
      category: TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
      details: {
        recIndex: 0,
        productType: 'RN_RS',
        physicalAddress: { address: 'Via Rosas 1829', zip: '98036', municipality: 'Graniti' },
      },
    };
    const sendEvent: INotificationDetailTimeline = {
      elementId: 'send-simple-registered-letter-0',
      timestamp: '2023-01-26T14:17:23.525827086Z',
      category: TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
      details: {
        recIndex: 0,
        productType: 'RN_RS',
        physicalAddress: { address: 'Via Rosas 1829', zip: '98036', municipality: 'Graniti' },
      },
    };
    const courtesyEvent: INotificationDetailTimeline = {
      elementId: 'send_courtesy_message_1',
      timestamp: '2023-01-26T14:17:26.525827086Z',
      category: TimelineCategory.SEND_COURTESY_MESSAGE,
      details: {
        recIndex: 0,
        sendDate: 'some-date',
        digitalAddress: { type: DigitalDomicileType.EMAIL, address: 'still.other@mail.it' },
      },
    };
    timeline.push(prepareEvent, sendEvent, courtesyEvent);

    // set the modified timeline
    sourceNotification.timeline = timeline;

    // change the status history accordingly
    const history = acceptedDeliveringDeliveredTimelineStatusHistory();
    // DELIVERED is the last status, the currently DIGITAL_SUCCESS_WORKFLOW its first element.
    history[2].relatedTimelineElements[0] = 'digital-failure-workflow';
    history[2].relatedTimelineElements.push(
      prepareEvent.elementId,
      sendEvent.elementId,
      courtesyEvent.elementId
    );
    sourceNotification.notificationStatusHistory = history;

    // now the test
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // the first status is DELIVERED
    let currentSteps = parsedNotification.notificationStatusHistory[0].steps;
    expect(currentSteps).toHaveLength(1);
    expect(currentSteps && currentSteps[0].category).toEqual(
      TimelineCategory.SEND_COURTESY_MESSAGE
    );
    expect(
      currentSteps && (currentSteps[0].details as DigitalWorkflowDetails).digitalAddress?.address
    ).toEqual('still.other@mail.it');

    // the second status is DELIVERING
    currentSteps = parsedNotification.notificationStatusHistory[1].steps;
    // 4 shifted from DELIVERED + 3 originally in DELIVERING + 2 copied from AACCEPTED
    expect(currentSteps).toHaveLength(9);
    expect(currentSteps && currentSteps[0].category).toEqual(
      TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER
    );
    expect(currentSteps && currentSteps[0].hidden).toBeFalsy();
    expect(currentSteps && currentSteps[1].category).toEqual(
      TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER
    );
    expect(currentSteps && currentSteps[1].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[2].category).toEqual(TimelineCategory.SCHEDULE_REFINEMENT);
    expect(currentSteps && currentSteps[2].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[3].category).toEqual(
      TimelineCategory.DIGITAL_FAILURE_WORKFLOW
    );
    expect(currentSteps && currentSteps[3].hidden).toBeTruthy();
    expect(currentSteps && currentSteps[4].category).toEqual(
      TimelineCategory.SEND_DIGITAL_FEEDBACK
    );
    expect(currentSteps && currentSteps[4].hidden).toBeFalsy();
  });

  it('recipient in VIEWED status - no delegate', () => {
    // add a VIEWED status with one NOTIFICATION_VIEWED element - no delegate
    const notificationViewedElement: INotificationDetailTimeline = {
      elementId: 'notification-viewed-0',
      timestamp: '2023-01-26T14:17:26.525827086Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: { recIndex: 0 },
    };
    const viewedStatus: NotificationStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2023-01-26T14:17:26.525827086Z',
      relatedTimelineElements: [notificationViewedElement.elementId],
    };
    const timeline = acceptedDeliveringDeliveredTimeline();
    timeline.push(notificationViewedElement);
    sourceNotification.timeline = timeline;
    const statusHistory = acceptedDeliveringDeliveredTimelineStatusHistory();
    statusHistory.push(viewedStatus);
    sourceNotification.notificationStatusHistory = statusHistory;

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    expect(parsedNotification.notificationStatusHistory).toHaveLength(4);
    expect(parsedNotification.notificationStatusHistory[0].status).toEqual(
      NotificationStatus.VIEWED
    );
    expect(parsedNotification.notificationStatusHistory[0].recipient).toBeFalsy();
  });

  it('recipient in VIEWED status - with delegate', () => {
    // add a VIEWED status with two NOTIFICATION_VIEWED element - both with delegate info
    const notificationViewedElement1: INotificationDetailTimeline = {
      elementId: 'notification-viewed-0',
      timestamp: '2023-01-26T14:17:26.525827086Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: {
        recIndex: 0,
        delegateInfo: {
          internalId: 'mocked-delegate-internal-id',
          taxId: 'GLLGLL64B15G702I',
          operatorUuid: 'mocked-delegate-uuid',
          mandateId: '7c69e30a-23cd-4ef2-9b95-98c5a9f4e636',
          denomination: 'galileo galilei',
          delegateType: RecipientType.PF,
        },
      },
    };
    const notificationViewedElement2: INotificationDetailTimeline = {
      elementId: 'notification-viewed-1',
      timestamp: '2023-01-26T14:17:36.525827086Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: {
        recIndex: 0,
        delegateInfo: {
          internalId: 'mocked-delegate-internal-id-2',
          taxId: 'LVLDAA85T50G702B',
          operatorUuid: 'mocked-delegate-uuid-2',
          mandateId: '8669e30a-23cd-4ef2-9b95-98c5a9f4e636',
          denomination: 'ada lovelace',
          delegateType: RecipientType.PF,
        },
      },
    };
    const viewedStatus: NotificationStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2023-01-26T14:17:26.525827086Z',
      relatedTimelineElements: [
        notificationViewedElement1.elementId,
        notificationViewedElement2.elementId,
      ],
    };
    const timeline = acceptedDeliveringDeliveredTimeline();
    timeline.push(notificationViewedElement1, notificationViewedElement2);
    sourceNotification.timeline = timeline;
    const statusHistory = acceptedDeliveringDeliveredTimelineStatusHistory();
    statusHistory.push(viewedStatus);
    sourceNotification.notificationStatusHistory = statusHistory;

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    expect(parsedNotification.notificationStatusHistory).toHaveLength(4);
    expect(parsedNotification.notificationStatusHistory[0].status).toEqual(
      NotificationStatus.VIEWED
    );
    expect(parsedNotification.notificationStatusHistory[0].steps).toHaveLength(2);
    expect(parsedNotification.notificationStatusHistory[0].recipient).toEqual(
      'galileo galilei (GLLGLL64B15G702I)'
    );
  });

  it('VIEWED status erased - multi-recipient notification, detail requested by a recipient who has not yet viewed the notification', () => {
    // add a recipient to the notification
    sourceNotification.recipients.push(additionalRecipient);

    // Add an EFFECTIVE_DATE status, and afterwards a VIEWED status with no NOTIFICATION_VIEWED element.
    // How could be possible to have an empth VIEWED status: here the scenario.
    // There is no NOTIFICATION_VIEWED element corresponding to the recipient
    // who has requested the detail,
    // then the API call filters all the NOTIFICATION_VIEWED elements
    // since they regard recipients other than the currently logged one.
    const refinementElement: INotificationDetailTimeline = {
      elementId: 'refinement-0',
      timestamp: '2023-01-26T14:18:26.525827086Z',
      category: TimelineCategory.REFINEMENT,
      details: { recIndex: 0 },
    };
    const effectiveDateStatus: NotificationStatusHistory = {
      status: NotificationStatus.EFFECTIVE_DATE,
      activeFrom: '2023-01-26T14:18:26.525827086Z',
      relatedTimelineElements: [refinementElement.elementId],
    };
    const viewedStatus: NotificationStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2023-01-26T14:20:26.525827086Z',
      relatedTimelineElements: [],
    };
    const timeline = acceptedDeliveringDeliveredTimeline();
    timeline.push(refinementElement);
    sourceNotification.timeline = timeline;
    const statusHistory = acceptedDeliveringDeliveredTimelineStatusHistory();
    statusHistory.push(effectiveDateStatus, viewedStatus);
    sourceNotification.notificationStatusHistory = statusHistory;

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    expect(parsedNotification.notificationStatusHistory).toHaveLength(5);
    expect(parsedNotification.notificationStatusHistory[0].status).toEqual(
      NotificationStatus.VIEWED
    );
  });

  it('injection of NotificationDetailOtherDocument for ANALOG_FAILURE_WORKFLOW step', () => {
    sourceNotification.notificationStatus = NotificationStatus.UNREACHABLE;
    sourceNotification.physicalCommunicationType = PhysicalCommunicationType.AR_REGISTERED_LETTER;
    sourceNotification.timeline = analogFailureTimeline();
    sourceNotification.notificationStatusHistory = analogFailureStatusHistory();

    // parse
    const parsedNotification = parseNotificationDetail(sourceNotification);

    // ----------- checks
    expect(parsedNotification.notificationStatusHistory).toHaveLength(3);
    expect(parsedNotification.notificationStatusHistory[0].status).toEqual(
      NotificationStatus.UNREACHABLE
    );
    expect(parsedNotification.notificationStatusHistory[1].status).toEqual(
      NotificationStatus.DELIVERING
    );
    const deliveryStatus = parsedNotification.notificationStatusHistory[1];
    const deliverySteps = deliveryStatus.steps;
    expect(deliverySteps && deliverySteps[0].category).toEqual(TimelineCategory.ANALOG_FAILURE_WORKFLOW);
    expect(deliverySteps && deliverySteps[0].legalFactsIds).toHaveLength(1);
    const legalFact = deliverySteps && deliverySteps[0].legalFactsIds && deliverySteps[0].legalFactsIds[0];
    expect((legalFact as NotificationDetailOtherDocument).documentId).toEqual('AAR-86-99');
    expect((legalFact as NotificationDetailOtherDocument).documentType).toEqual(LegalFactType.AAR);
  });
});

describe('timeline legal fact link text', () => {
  it('return legalFact label - default', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.GET_ADDRESS;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0]);
    expect(label).toBe('detail.legalfact');
  });

  it('return legalFact label - SEND_ANALOG_PROGRESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_ANALOG_PROGRESS;
    parsedNotificationCopy.timeline[0].legalFactsIds = [{
      key: "legal-fact-1", category: LegalFactType.AAR
    }]
    parsedNotificationCopy.timeline[0].details = {
      attachments: [{ documentType: "Plico", url: "legal-fact-1", id: "attachment-id-1" }]
    }
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.AAR, "legal-fact-1");
    expect(label).toBe('detail.timeline.analog-workflow-attachment-kind.Plico');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (success) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).deliveryDetailCode = 'C001';
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.PEC_RECEIPT);
    expect(label).toBe('detail.receipt detail.timeline.legalfact.pec-receipt-accepted');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (failure) - PEC_RECEIPT', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.SEND_DIGITAL_PROGRESS;
    (parsedNotificationCopy.timeline[0].details as SendDigitalDetails).deliveryDetailCode = 'C008';
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
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.DIGITAL_DELIVERY
    );
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.digital-delivery-success');
  });

  it('return legalFact label - DIGITAL_FAILURE_WORKFLOW - DIGITAL_DELIVERY', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.DIGITAL_FAILURE_WORKFLOW;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.DIGITAL_DELIVERY
    );
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.digital-delivery-failure');
  });

  it('return legalFact label - COMPLETELY_UNREACHABLE', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.COMPLETELY_UNREACHABLE;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.ANALOG_FAILURE_DELIVERY);
    expect(label).toBe('detail.timeline.legalfact.analog-failure-delivery');
  });

  it('return legalFact label - ANALOG_FAILURE_WORKFLOW', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.ANALOG_FAILURE_WORKFLOW;
    const label = getLegalFactLabel(parsedNotificationCopy.timeline[0], LegalFactType.AAR);
    expect(label).toBe('detail.timeline.aar-document');
  });

  // Similar to the SENDER_ACK case above, in this case the timeline event category
  // associated but not explicitly verified in the code is NOTIFICATION_VIEWED
  // ------------------------------------
  // Carlos Lombardi, 2023.02.28
  // ------------------------------------
  it('return legalFact label - NOTIFICATION_VIEWED - RECIPIENT_ACCESS', () => {
    parsedNotificationCopy.timeline[0].category = TimelineCategory.NOTIFICATION_VIEWED;
    const label = getLegalFactLabel(
      parsedNotificationCopy.timeline[0],
      LegalFactType.RECIPIENT_ACCESS
    );
    expect(label).toBe('detail.legalfact: detail.timeline.legalfact.recipient-access');
  });
});
