import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
export declare class NotHandledStep extends TimelineStep {
    getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
