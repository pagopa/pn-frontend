import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class DigitalFailureWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'digital-failure-workflow',
        payload.isMultiRecipient,
        undefined,
        undefined,
        this.nameAndTaxId(payload)
      ),
    };
  }
}
