import { TimelineStep, TimelineStepInfo } from './TimelineStep';

export class NotificationCancelledStep extends TimelineStep {
  /*   getTimelineStepInfo( payload: TimelineStepPayload ): TimelineStepInfo | null {
    return null;
  } */
  getTimelineStepInfo(): TimelineStepInfo | null {
    return {
      label: 'Annullata',
      description: "L'ente ha annullato la notifica",
    };
  }
}
