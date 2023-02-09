import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-error',
          'Invio via PEC non riuscito',
          `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
            (payload.step.details as SendDigitalDetails).digitalAddress?.address
          } non è riuscito perché la casella è satura, non valida o inattiva.`,
          {
            name: payload.recipient?.denomination,
            address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
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
