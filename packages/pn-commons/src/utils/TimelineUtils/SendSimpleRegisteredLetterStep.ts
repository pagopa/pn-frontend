import { AnalogWorkflowDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendSimpleRegisteredLetterStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'send-simple-registered-letter',
        'Invio via raccomandata semplice',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
          (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata semplice.`,
        {
          name: payload.recipient?.denomination,
          address: (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
