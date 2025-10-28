import {
  AnalogWorkflowDetails,
  PhysicalCommunicationType,
  SendPaperDetails,
} from '../../models/NotificationDetail';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogDomicileStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    // This event indicates the specific postal product used to send the notification
    // through a paper channel.
    // But there is a relevant detail about this: it could be the case that
    // PN *asks* for a specific product to be used,
    // but paper-channel *decides* for a different product to be effectively used.
    // The difference regards in particular the international letter shipping,
    // since the "Raccomandata 890" makes sense only for Italy postal destinations.
    // -----------------------
    // We have decided to show the product PN asked, indicated in the serviceLevel attribute
    // in the details.
    // The reference to the product effectively sent is indicated instead
    // in the productType attribute, also in the details.
    // -----------------------
    // Carlos Lombardi (along with Alice Azzolini, Norma Cocito and Carlotta Dimatteo), 2023.02.24
    if (
      (payload.step.details as SendPaperDetails).serviceLevel ===
      PhysicalCommunicationType.REGISTERED_LETTER_890
    ) {
      return {
        ...this.localizeTimelineStatus(
          'send-analog-domicile-890',
          payload.isMultiRecipient,
          'Invio via raccomandata 890',
          `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
            (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
          } tramite raccomandata 890.`,
          {
            ...this.nameAndTaxId(payload),
            ...this.completePhysicalAddressFromStep(payload.step),
          }
        ),
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-analog-domicile-ar',
        payload.isMultiRecipient,
        'Invio via raccomandata A/R',
        `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${
          (payload.step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata A/R.`,
        {
          ...this.nameAndTaxId(payload),
          ...this.completePhysicalAddressFromStep(payload.step),
        }
      ),
    };
  }
}
