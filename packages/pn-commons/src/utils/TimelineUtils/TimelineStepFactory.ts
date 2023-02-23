import { INotificationDetailTimeline, TimelineCategory } from '../../types';
import { ScheduleDigitalWorkflowStep } from './ScheduleDigitalWorkflowStep';
import { TimelineStep } from './TimelineStep';
import { DefaultStep } from './DefaultStep';
import { SendAnalogProgressStep } from './SendAnalogProgressStep';
import { SendAnalogFeedbackStep } from './SendAnalogFeedbackStep';
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
      case TimelineCategory.NOT_HANDLED:
        return new NotHandledStep();
      case TimelineCategory.SEND_ANALOG_PROGRESS:
        return new SendAnalogProgressStep();
      case TimelineCategory.SEND_ANALOG_FEEDBACK:
        return new SendAnalogFeedbackStep();
      default:
        return new DefaultStep();
    }
  }
}
