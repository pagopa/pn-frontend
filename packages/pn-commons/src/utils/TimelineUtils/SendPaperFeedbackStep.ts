import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
import { localizeTimelineStatus } from './TimelineStepFactory';

export class SendPaperFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...localizeTimelineStatus(
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
