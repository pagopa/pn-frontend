import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class CompletelyUnreachableStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'completely-unreachable',
        payload.isMultiRecipient,
        'Deposito di avvenuta ricezione',
        '',
        this.nameAndTaxId(payload)
      ),
    };
  }
}
