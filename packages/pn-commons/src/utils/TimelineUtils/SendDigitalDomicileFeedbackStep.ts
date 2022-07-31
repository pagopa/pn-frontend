import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
import { localizeTimelineStatus } from './TimelineStepFactory';

export class SendDigitalDomicileFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...localizeTimelineStatus(
          'send-digital-domicile-error',
          'Invio via PEC fallito',
          `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
            (payload.step.details as SendDigitalDetails).digitalAddress?.address
          } non è riuscito.`,
          {
            name: payload.recipient?.denomination,
            address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
          }
        ),
        linkText: payload.legalFactLabel,
        recipient: payload.recipientLabel,
      };
    }
    return {
      ...localizeTimelineStatus(
        'send-digital-domicile-success',
        'Invio via PEC riuscito',
        `L' invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
          (payload.step.details as SendDigitalDetails).digitalAddress?.address
        } è riuscito.`,
        {
          name: payload.recipient?.denomination,
          address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
        }
      ),
      linkText: payload.legalFactLabel,
      recipient: payload.recipientLabel,
    };
  }
}
