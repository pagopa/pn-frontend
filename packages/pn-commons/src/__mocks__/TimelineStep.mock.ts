import {
  DigitalDomicileType,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
} from '../types';
import { TimelineStepPayload } from '../utils/TimelineUtils/TimelineStep';

const step = {
  timestamp: 'mocked-timestamp',
  elementId: 'mocked-id',
  category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
  details: {
    recIndex: 0,
    reason: 'Paper message not handled',
    reasonCode: '001',
    serviceLevel: PhysicalCommunicationType.REGISTERED_LETTER_890,
    deliveryDetailCode: 'mocked-code',
    sendRequestId: 'mocked-id',
    productType: '890',
    deliveryFailureCause: 'delivery-failure-cause',
    physicalAddress: {
      at: '',
      address: 'VIATORINO 15',
      addressDetails: '',
      zip: '20092',
      municipality: 'CINISELLOBALSAMO',
      municipalityDetails: 'CINISELLOBALSAMO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    digitalAddress: {
      type: DigitalDomicileType.EMAIL,
      address: 'mock@mock.com',
    },
  },
};

export const mockTimelineStepAnalogFailureWorkflow: TimelineStepPayload = {
  step,
  recipient: {
    recipientType: RecipientType.PF,
    taxId: 'LVLDAA85T50G702B',
    denomination: 'Ada Lovelace',
  },
  isMultiRecipient: false,
};

export const mockTimelineStepSendDigitalWorkflow: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
  },
};

export const mockTimelineStepSendAnalogDomicile890: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
  },
};

export const mockTimelineStepSendDigitalDomicile: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
  },
};

export const mockTimelineStepSendDigitalFeedback: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
  },
};

export const mockTimelineStepSendDigitalProgress: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
  },
};
export const mockTimelineStepSendAnalogDomicileAR: TimelineStepPayload = {
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...step,
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      ...step.details,
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
    },
  },
};
