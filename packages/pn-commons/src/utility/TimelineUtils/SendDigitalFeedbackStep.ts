import { SERCQ_SEND_VALUE } from '../../models/Contacts';
import { DigitalDomicileType, SendDigitalDetails } from '../../models/NotificationDetail';
import { hasLocalizedLabel } from '../localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendDigitalFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const details = payload.step.details as SendDigitalDetails;
    if (details.responseStatus === 'KO') {
      return {
        ...this.localizeTimelineStatus(
          'send-digital-error',
          payload.isMultiRecipient,
          'Invio via PEC non riuscito',
          `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${details.digitalAddress?.address} non è riuscito perché la casella è satura, non valida o inattiva.`,
          {
            ...this.nameAndTaxId(payload),
            address: details.digitalAddress?.address,
          },
          payload.delegatorName
        ),
      };
    }
    if (
      details.digitalAddress?.type === DigitalDomicileType.SERCQ &&
      details.digitalAddress?.address.startsWith(SERCQ_SEND_VALUE)
    ) {
      const statusInfo = this.localizeTimelineStatus(
        'send-digital-success-SERCQ-SEND',
        payload.isMultiRecipient,
        undefined,
        undefined,
        {
          ...this.nameAndTaxId(payload),
          address: details.digitalAddress?.address,
        },
        payload.delegatorName
      );
      if (!payload.isNewTimelineCopyEnabled) {
        return statusInfo;
      }
      // with the new copy, the description is shown only in the delegate view
      const showDelegateDescription =
        !!payload.delegatorName &&
        hasLocalizedLabel(
          'notifications',
          'detail.timeline.send-digital-success-SERCQ-SEND-description-delegate'
        );
      return showDelegateDescription ? statusInfo : { ...statusInfo, description: '' };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-digital-success-PEC',
        payload.isMultiRecipient,
        'Invio via PEC riuscito',
        `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${details.digitalAddress?.address} è riuscito.`,
        {
          ...this.nameAndTaxId(payload),
          address: details.digitalAddress?.address,
        },
        payload.delegatorName
      ),
    };
  }
}
