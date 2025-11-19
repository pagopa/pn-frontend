import { SERCQ_SEND_VALUE } from '../../models/Contacts';
import { DigitalDomicileType, SendDigitalDetails } from '../../models/NotificationDetail';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalDomicileStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const details = payload.step.details as SendDigitalDetails;
    if (!details.digitalAddress?.address) {
      // if digital domicile is undefined
      return null;
    }
    if (
      details.digitalAddress?.type === DigitalDomicileType.SERCQ &&
      details.digitalAddress?.address.startsWith(SERCQ_SEND_VALUE)
    ) {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-domicile-SERCQ-SEND',
          payload.isMultiRecipient,
          undefined,
          undefined,
          {
            ...this.nameAndTaxId(payload),
            address: details.digitalAddress?.address,
          }
        ),
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-digital-domicile-PEC',
        payload.isMultiRecipient,
        'Invio via PEC',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${details.digitalAddress?.address}`,
        {
          ...this.nameAndTaxId(payload),
          address: details.digitalAddress?.address,
        }
      ),
    };
  }
}
