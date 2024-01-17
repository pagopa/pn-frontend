import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
export declare class SendAnalogFlowStep extends TimelineStep {
    getTimelineStepLabel(payload: TimelineStepPayload): string;
    getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
