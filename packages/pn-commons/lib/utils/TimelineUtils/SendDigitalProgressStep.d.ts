import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
export declare class SendDigitalProgressStep extends TimelineStep {
    getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
