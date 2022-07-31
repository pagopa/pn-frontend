import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
import { localizeTimelineStatus } from './TimelineStepFactory';

export class SendDigitalFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...localizeTimelineStatus(
          'send-digital-error',
          'Invio per via digitale fallito',
          `L'invio della notifica a ${payload.recipient?.denomination} per via digitale non è riuscito.`,
          {
            name: payload.recipient?.denomination,
          }
        ),
        linkText: payload.legalFactLabel,
        recipient: payload.recipientLabel,
      };
    }
    return {
      ...localizeTimelineStatus(
        'send-digital-success',
        'Invio per via digitale riuscito',
        `L'invio della notifica a ${payload.recipient?.denomination} per via digitale è riuscito.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      linkText: payload.legalFactLabel,
      recipient: payload.recipientLabel,
    };
  }
}
