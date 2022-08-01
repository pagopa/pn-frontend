import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendPaperFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'send-paper-feedback',
        'Aggiornamento stato raccomandata',
        `Si allega un aggiornamento dello stato della raccomandata.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      linkText: payload.receiptLabel,
      recipient: `${payload.recipient?.taxId} - ${payload.recipient?.denomination}`,
    };
  }
}
