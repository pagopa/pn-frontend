import { SendPaperDetails, TimelineCategory } from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

const SEND_ANALOG_FEEDBACK_OK_DETAIL_CODES = [
  'RECRN001C',
  'RECRN003C',
  'RECAG001C',
  'RECAG002C',
  'RECAG005C',
  'RECAG006C',
  'RECRI003C',
  'RECAG012',
];

const SEND_ANALOG_FEEDBACK_KO_DETAIL_CODES = [
  'RECRN002C',
  'RECRN002F',
  'PNRN012',
  'RECRN004C',
  'RECAG003C',
  'RECAG003F',
  'PNAG012',
  'RECAG007C',
  'RECRI004C',
];

function i18nLabelEntry(category: TimelineCategory, deliveryDetailCode: string | undefined) {
  const sendAnalogFeedbackEntry = () =>
    deliveryDetailCode
      ? SEND_ANALOG_FEEDBACK_OK_DETAIL_CODES.includes(deliveryDetailCode)
        ? 'send-analog-success'
        : SEND_ANALOG_FEEDBACK_KO_DETAIL_CODES.includes(deliveryDetailCode)
        ? 'send-analog-error'
        : 'send-analog-outcome-unknown'
      : 'send-analog-unknown';

  return category === TimelineCategory.SEND_ANALOG_FEEDBACK
    ? sendAnalogFeedbackEntry()
    : category === TimelineCategory.SEND_ANALOG_PROGRESS
    ? 'send-analog-progress'
    : category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
    ? `simple-registered-letter-progess`
    : 'send-analog-unknown';
}

export class SendAnalogFlowStep extends TimelineStep {
  getTimelineStepLabel(payload: TimelineStepPayload): string {
    const typedDetails = payload.step.details as SendPaperDetails;

    // to avoid cognitive complexity warning
    const labelEntry = i18nLabelEntry(payload.step.category, typedDetails.deliveryDetailCode);

    const defaultLabel =
      payload.step.category === TimelineCategory.SEND_ANALOG_PROGRESS
        ? `Aggiornamento sull'invio cartaceo`
        : payload.step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
        ? `Aggiornamento dell'invio via raccomandata semplice`
        : 'Invio cartaceo completato';

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
    const originatingStep = payload.allStepsForThisStatus?.find(
      (step) => step.elementId === (payload.step.details as SendPaperDetails).sendRequestId
    );

    const registeredLetterKindCode =
      originatingStep && (originatingStep.details as SendPaperDetails).productType;
    const registeredLetterKindI18n = registeredLetterKindCode
      ? getLocalizedOrDefaultLabel(
          'notifications',
          `detail.timeline.registered-letter-kind.${registeredLetterKindCode}`,
          ''
        )
      : '';
    const registeredLetterKindText =
      registeredLetterKindI18n.length === 0
        ? registeredLetterKindI18n // i.e. ''
        : ` ${registeredLetterKindI18n}`;

    const deliveryFailureCauseCode = (payload.step.details as SendPaperDetails)
      .deliveryFailureCause;
    const deliveryFailureCauseText = deliveryFailureCauseCode
      ? getLocalizedOrDefaultLabel(
          'notifications',
          `detail.timeline.analog-workflow-failure-cause.${deliveryFailureCauseCode}`,
          ''
        )
      : '';

    const registeredLetterNumber =
      (payload.step.details as SendPaperDetails).registeredLetterCode ?? '';
    const physicalAddress = originatingStep
      ? this.completePhysicalAddressFromStep(originatingStep)
      : {};

    // eslint-disable-next-line functional/no-let
    let description = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.send-analog-flow-${deliveryDetailCode}-description${
        payload.isMultiRecipient ? '-multirecipient' : ''
      }`,
      '',
      {
        ...this.nameAndTaxId(payload),
        ...physicalAddress,
        registeredLetterKind: registeredLetterKindText,
        deliveryFailureCause: deliveryFailureCauseText,
        registeredLetterNumber,
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
