import { TimelineStep, TimelineStepInfo } from './TimelineStep';

export class DefaultStep extends TimelineStep {
  getTimelineStepInfo(): TimelineStepInfo | null {
    return {
      label: 'Non definito',
      description: 'Stato sconosciuto',
    };
  }
}
