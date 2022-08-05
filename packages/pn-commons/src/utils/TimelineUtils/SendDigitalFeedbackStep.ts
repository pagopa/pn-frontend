import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-error',
          'Invio per via digitale non riuscito',
          `Il tentativo di invio della notifica per via digitale a ${payload.recipient?.denomination} non è riuscito.`,
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
        `Il tentativo di invio della notifica per via digitale a ${payload.recipient?.denomination} è riuscito.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
