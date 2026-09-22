import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class DigitalSuccessWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'digital-success-workflow',
        payload.isMultiRecipient,
        undefined,
        undefined,
        this.nameAndTaxId(payload)
      ),
    };
  }
}
