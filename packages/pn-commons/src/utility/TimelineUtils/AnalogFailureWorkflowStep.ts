import { getLocalizedOrDefaultLabel, hasLocalizedLabel } from '../localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

const MONORECIPIENT_LABEL_PATH = 'detail.timeline.analog-failure-workflow-monorecipient';

// PN-6902
export class AnalogFailureWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const statusInfo = this.localizeTimelineStatus(
      'analog-failure-workflow',
      payload.isMultiRecipient,
      'Invio analogico assolutamente fallimentare',
      `Invio analogico a ${payload.recipient?.denomination} assolutamente fallimentare.`,
      this.nameAndTaxId(payload),
      payload.delegatorName
    );

    // the recipient's direct view of a mono recipient notification can have a specific title
    const useMonorecipientLabel =
      !payload.isMultiRecipient &&
      !payload.delegatorName &&
      hasLocalizedLabel('notifications', MONORECIPIENT_LABEL_PATH);

    return useMonorecipientLabel
      ? {
          ...statusInfo,
          label: getLocalizedOrDefaultLabel(
            'notifications',
            MONORECIPIENT_LABEL_PATH,
            statusInfo.label
          ),
        }
      : statusInfo;
  }
}
