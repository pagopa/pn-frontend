import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { SendPaperDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const label = getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.send-analog-progress',
      `Aggiornamento sull'invio cartaceo`
    );
    const deliveryDetailCode = (payload.step.details as SendPaperDetails).deliveryDetailCode;

    // to obtain the registeredLetterKindCode, we must fetch the "originating" SEND_ANALOG_DOMICILE 
    // event for the current SEND_ANALOG_PROGRESS.
    // We can find the "originating" event through the sendRequestId.
    const originatingStep = payload.allStepsForThisStatus?.find(step => step.elementId === (payload.step.details as SendPaperDetails).sendRequestId);

    const registeredLetterKindCode = originatingStep && (originatingStep.details as SendPaperDetails).productType;
    const registeredLetterKindI18n = registeredLetterKindCode 
      ? getLocalizedOrDefaultLabel('notifications', `detail.timeline.registered-letter-kind.${registeredLetterKindCode}`, '')
      : '';
    const registeredLetterKindText = registeredLetterKindI18n.length === 0 
      ? registeredLetterKindI18n           // i.e. ''
      : ` ${registeredLetterKindI18n}`;
      
    console.log({ payload, registeredLetterKindCode, registeredLetterKindI18n, registeredLetterKindText });
    let description = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.send-analog-progress-${deliveryDetailCode}-description${payload.isMultiRecipient ? '-multirecipient' : ''}`,
      '',
      {...this.nameAndTaxId(payload), registeredLetterKind: registeredLetterKindText}
    );

    if (description.length === 0) {
      description = getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.send-analog-progress-description`,
        `C'è un aggiornamento sull'invio cartaceo.`
      );
    }

    return { label, description };
  }
}
