import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogProgressStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const deliveryDetailCode = (payload.step.details as any).deliveryDetailCode as string;
    if (deliveryDetailCode === "CON080") {
      return {
        ...this.localizeTimelineStatus(
          `send-analog-progress-${deliveryDetailCode}`,
          payload.isMultiRecipient, 
          `Aggiornamento sull'invio cartaceo`,
          `C'è un aggiornamento sull'invio cartaceo.`,
        ),
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-analog-progress',
        payload.isMultiRecipient, 
        `Aggiornamento sull'invio cartaceo`,
        `C'è un aggiornamento sull'invio cartaceo.`,
      ),
    };
  }
}
