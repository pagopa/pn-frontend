import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-error',
          'Invio per via digitale fallito',
          `L'invio della notifica a ${payload.recipient?.denomination} per via digitale non è riuscito.`,
          {
            name: payload.recipient?.denomination,
          }
        ),
        recipient: payload.recipientLabel,
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-digital-success',
        'Invio per via digitale riuscito',
        `L'invio della notifica a ${payload.recipient?.denomination} per via digitale è riuscito.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
