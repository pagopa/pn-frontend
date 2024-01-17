import { TimelineStep } from './TimelineStep';
export class DefaultStep extends TimelineStep {
    getTimelineStepInfo() {
        return {
            label: 'Non definito',
            description: 'Stato sconosciuto',
        };
    }
}
