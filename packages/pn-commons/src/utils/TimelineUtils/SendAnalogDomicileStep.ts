import { AnalogWorkflowDetails, PhysicalCommunicationType, SendPaperDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogDomicileStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if (
      (payload.step.details as SendPaperDetails).serviceLevel ===
      PhysicalCommunicationType.REGISTERED_LETTER_890
    ) {
      return {
        ...this.localizeTimelineStatus(
          'send-analog-domicile-890',
          'Invio via raccomandata 890',
          `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
            (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
          } tramite raccomandata 890.`,
          {
            name: payload.recipient?.denomination,
            address: (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address,
          }
        ),
        recipient: payload.recipientLabel,
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-analog-domicile-ar',
        'Invio via raccomandata A/R',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
          (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata A/R.`,
        {
          name: payload.recipient?.denomination,
          address: (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
