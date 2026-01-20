import { AnalogWorkflowDetails } from '../../models/NotificationDetail';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendSimpleRegisteredLetterStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'send-simple-registered-letter',
        payload.isMultiRecipient,
        'Invio via raccomandata semplice',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
          (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata semplice.`,
        {
          ...this.nameAndTaxId(payload),
          ...this.completePhysicalAddressFromStep(payload.step),
        }
      ),
    };
  }
}
