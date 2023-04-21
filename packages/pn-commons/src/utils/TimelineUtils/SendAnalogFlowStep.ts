import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { ResponseStatus, SendPaperDetails, TimelineCategory } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogFlowStep extends TimelineStep {
  getTimelineStepLabel(payload: TimelineStepPayload): string {
    const responseStatus = (payload.step.details as SendPaperDetails).responseStatus; //  === ResponseStatus.KO

    const labelEntry = payload.step.category === TimelineCategory.SEND_ANALOG_PROGRESS
      ? 'send-analog-progress'
      : payload.step.category === TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS ? `simple-registered-letter-progess`
      : responseStatus === ResponseStatus.KO ? 'send-analog-error' : 'send-analog-success';

    const defaultLabel = payload.step.category === TimelineCategory.SEND_ANALOG_PROGRESS
      ? `Aggiornamento sull'invio cartaceo`
      : payload.step.category === TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS ? `Aggiornamento dell'invio via raccomandata semplice`
      : responseStatus === ResponseStatus.KO ? 'Invio per via cartacea non riuscito' : 'Invio per via cartacea riuscito';

    return getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.${labelEntry}`,
      defaultLabel
    );
  }

  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    // label - separate method just to avoid "cognitive complexity" eslint errors
    // ///////////////////////////////////////////////////////////////
    const label = this.getTimelineStepLabel(payload);

    // details
    // ///////////////////////////////////////////////////////////////
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
      
    const deliveryFailureCauseCode = (payload.step.details as SendPaperDetails).deliveryFailureCause;
    const deliveryFailureCauseText = deliveryFailureCauseCode 
      ? getLocalizedOrDefaultLabel('notifications', `detail.timeline.analog-workflow-failure-cause.${deliveryFailureCauseCode}`, '')
      : '';

    const registeredLetterNumber = (payload.step.details as SendPaperDetails).registeredLetterCode || '';
    
    if (deliveryDetailCode === 'CON080') {
      console.log({ payload, registeredLetterKindCode, registeredLetterKindI18n, registeredLetterKindText, 
        deliveryFailureCauseCode, deliveryFailureCauseText });
    }

    // eslint-disable-next-line functional/no-let
    let description = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.send-analog-flow-${deliveryDetailCode}-description${payload.isMultiRecipient ? '-multirecipient' : ''}`,
      '',
      { 
        ...this.nameAndTaxId(payload), 
        registeredLetterKind: registeredLetterKindText, 
        deliveryFailureCause: deliveryFailureCauseText,
        registeredLetterNumber
      }
    );

    if (description.length === 0) {
      description = getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.send-analog-flow-description`,
        `C'è un aggiornamento sull'invio cartaceo.`
      );
    }

    return { label, description };
  }
}
