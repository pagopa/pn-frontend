import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class DigitalFailureWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'digital-failure-workflow',
        payload.isMultiRecipient,
        'Attestazione opponibile a terzi: mancato recapito digitale',
        '',
        this.nameAndTaxId(payload)
      ),
    };
  }
}
