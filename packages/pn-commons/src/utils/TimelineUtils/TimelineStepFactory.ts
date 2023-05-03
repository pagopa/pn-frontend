import { INotificationDetailTimeline, TimelineCategory } from '../../types';
import { ScheduleDigitalWorkflowStep } from './ScheduleDigitalWorkflowStep';
import { TimelineStep } from './TimelineStep';
import { DefaultStep } from './DefaultStep';
import { SendAnalogFlowStep } from './SendAnalogFlowStep';
import { SendCourtesyMessageStep } from './SendCourtesyMessageStep';
import { SendDigitalDomicileStep } from './SendDigitalDomicileStep';
import { SendDigitalFeedbackStep } from './SendDigitalFeedbackStep';
import { SendDigitalProgressStep } from './SendDigitalProgressStep';
import { SendSimpleRegisteredLetterStep } from './SendSimpleRegisteredLetterStep';
import { SendAnalogDomicileStep } from './SendAnalogDomicileStep';
import { NotHandledStep } from './NotHandledStep';

export class TimelineStepFactory {
  static createTimelineStep(step: INotificationDetailTimeline): TimelineStep {
    switch (step.category) {
      case TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW:
        return new ScheduleDigitalWorkflowStep();
      case TimelineCategory.SEND_COURTESY_MESSAGE:
        return new SendCourtesyMessageStep();
      case TimelineCategory.SEND_DIGITAL_DOMICILE:
        return new SendDigitalDomicileStep();
      case TimelineCategory.SEND_DIGITAL_FEEDBACK:
        return new SendDigitalFeedbackStep();
      case TimelineCategory.SEND_DIGITAL_PROGRESS:
        return new SendDigitalProgressStep();
      case TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER:
         return new SendSimpleRegisteredLetterStep();
      case TimelineCategory.SEND_ANALOG_DOMICILE:
         return new SendAnalogDomicileStep();

      // analog flow events: all processed by the same class
      case TimelineCategory.SEND_ANALOG_FEEDBACK:
        return new SendAnalogFlowStep();
      case TimelineCategory.SEND_ANALOG_PROGRESS:
        return new SendAnalogFlowStep();
      case TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS:
        return new SendAnalogFlowStep();
      // -------------------------------------------
        
      case TimelineCategory.NOT_HANDLED:
        return new NotHandledStep();
      default:
        return new DefaultStep();
    }
  }
}
