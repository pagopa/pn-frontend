import { SendPaperDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'send-analog-progress',
        'Invio via raccomandata preso in carico',
        `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
          (payload.step.details as SendPaperDetails).physicalAddress.address
        } è stato preso in carico.`,
        {
          name: payload.recipient?.denomination,
          address: (payload.step.details as SendPaperDetails).physicalAddress.address,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
