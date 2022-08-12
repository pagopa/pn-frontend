import { SendDigitalDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendDigitalDetails).responseStatus === 'KO') {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-progress-error',
          'Invio via PEC non preso in carico',
          `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
            (payload.step.details as SendDigitalDetails).digitalAddress?.address
          } non è stato preso in carico.`,
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
        'send-digital-progress-success',
        'Invio via PEC preso in carico',
        `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
          (payload.step.details as SendDigitalDetails).digitalAddress?.address
        } è stato preso in carico.`,
        {
          name: payload.recipient?.denomination,
          address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
