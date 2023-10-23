import { SendDigitalDetails } from '../../models';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalDomicileStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if (!(payload.step.details as SendDigitalDetails).digitalAddress?.address) {
      // if digital domicile is undefined
      return null;
    }
    return {
      ...this.localizeTimelineStatus(
        'send-digital-domicile',
        payload.isMultiRecipient,
        'Invio via PEC',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${
          (payload.step.details as SendDigitalDetails).digitalAddress?.address
        }`,
        {
          ...this.nameAndTaxId(payload),
          address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
        }
      ),
    };
  }
}
