import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
export declare class PrepareAnalogDomicileFailureStep extends TimelineStep {
    getTimelineStepLabel(): string;
    getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
