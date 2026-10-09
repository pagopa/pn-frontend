import { LegalFactType, SendDigitalDetails } from '../../models/NotificationDetail';
import { hasLocalizedLabel } from '../localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const deliveryDetailCode = (payload.step.details as SendDigitalDetails).deliveryDetailCode;

    if (
      deliveryDetailCode === 'C008' ||
      deliveryDetailCode === 'C010' ||
      deliveryDetailCode === 'DP10'
    ) {
      return this.getProgressStepInfo(payload, 'error');
    } else if (deliveryDetailCode === 'C001' || deliveryDetailCode === 'DP00') {
      return this.getProgressStepInfo(payload, 'success');
    }
    return null;
  }

  private getProgressStepInfo(
    payload: TimelineStepPayload,
    outcome: 'success' | 'error'
  ): TimelineStepInfo {
    const address = (payload.step.details as SendDigitalDetails).digitalAddress?.address;

    const translationData = { ...this.nameAndTaxId(payload), address };

    const noReceiptDescriptionKey = `detail.timeline.send-digital-progress-${outcome}-description-no-receipt`;

    const useNoReceiptDescription =
      hasLocalizedLabel('notifications', noReceiptDescriptionKey) &&
      !payload.step.legalFactsIds?.some(
        (legalFact) => legalFact.category === LegalFactType.PEC_RECEIPT
      );

    const stepInfo = this.localizeTimelineStatus(
      `send-digital-progress-${outcome}`,
      payload.isMultiRecipient,
      outcome === 'success' ? 'Invio via PEC preso in carico' : 'Invio via PEC non preso in carico',
      outcome === 'success'
        ? `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${address} è stato preso in carico.`
        : `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${address} non è stato preso in carico.`,
      translationData,
      payload.delegatorName
    );

    return useNoReceiptDescription
      ? {
          ...stepInfo,
          description: this.localizeDescription(
            noReceiptDescriptionKey,
            payload.isMultiRecipient,
            stepInfo.description,
            translationData,
            payload.delegatorName
          ),
        }
      : stepInfo;
  }
}
