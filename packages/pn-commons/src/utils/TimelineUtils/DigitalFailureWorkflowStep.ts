import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class DigitalFailureWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      label: 'Invio per via digitale non riuscito',
      description: `L'invio per via digitale della notifica non è riuscito.`,
      linkText: payload.receiptLabel,
      recipient: payload.recipientLabel,
    };
  }
}
