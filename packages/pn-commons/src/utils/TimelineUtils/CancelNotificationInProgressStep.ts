import { TimelineStep, TimelineStepInfo } from './TimelineStep';

export class CancelNotificationInProgressStep extends TimelineStep {
  /*  getTimelineStepInfo( payload: TimelineStepPayload ): TimelineStepInfo | null {
    return null;
  } */
  getTimelineStepInfo(): TimelineStepInfo | null {
    return {
      label: 'Annullata',
      description: 'Annullamento in corso. Lo stato sarà aggiornato a breve.',
    };
  }
}
