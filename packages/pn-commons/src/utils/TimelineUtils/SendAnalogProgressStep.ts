import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'send-analog-progress',
        payload.isMultiRecipient, 
        `Aggiornamento sull'invio cartaceo`,
        `C'è un aggiornamento sull'invio cartaceo.`,
      ),
      recipient: payload.recipientLabel,
    };
  }
}
