import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
export declare class SendSimpleRegisteredLetterStep extends TimelineStep {
    getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
