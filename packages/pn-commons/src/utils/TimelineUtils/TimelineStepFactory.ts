import { INotificationDetailTimeline, TimelineCategory } from '../../types';
import { ScheduleDigitalWorkflowStep } from './ScheduleDigitalWorkflowStep';
import { TimelineStep } from './TimelineStep';
import { DefaultStep } from './DefaultStep';
import { SendAnalogProgressStep } from './SendAnalogProgressStep';
import { SendAnalogFeedbackStep } from './SendAnalogFeedbackStep';
import { ScheduleAnalogWorkflowStep } from './ScheduleAnalogWorkflow';
import { SendCourtesyMessageStep } from './SendCourtesyMessageStep';
import { SendDigitalDomicileStep } from './SendDigitalDomicileStep';
import { SendDigitalDomicileFeedbackStep } from './SendDigitalDomicileFeedbackStep';
import { SendDigitalFeedbackStep } from './SendDigitalFeedbackStep';
import { SendDigitalProgressStep } from './SendDigitalProgressStep';
import { SendSimpleRegisteredLetterStep } from './SendSimpleRegisteredLetterStep';
import { SendAnalogDomicileStep } from './SendAnalogDomicileStep';
import { DigitalFailureWorkflowStep } from './DigitalFailureWorkflowStep';
import { NotHandledStep } from './NotHandledStep';

export class TimelineStepFactory {
  static createTimelineStep(step: INotificationDetailTimeline): TimelineStep {
    switch (step.category) {
      case TimelineCategory.SCHEDULE_ANALOG_WORKFLOW:
        return new ScheduleAnalogWorkflowStep();
      case TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW:
        return new ScheduleDigitalWorkflowStep();
      case TimelineCategory.SEND_COURTESY_MESSAGE:
        return new SendCourtesyMessageStep();
      case TimelineCategory.SEND_DIGITAL_DOMICILE:
        return new SendDigitalDomicileStep();

      // BEWARE - this case should be removed. See comment in /src/types/NotificationDetail.ts
      // --------------------------------------
      // Carlos Lombardi, 2023.02.10

      case TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK:
        return new SendDigitalDomicileFeedbackStep();
      case TimelineCategory.SEND_DIGITAL_FEEDBACK:
        return new SendDigitalFeedbackStep();
      case TimelineCategory.SEND_DIGITAL_PROGRESS:
        return new SendDigitalProgressStep();
      case TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER:
         return new SendSimpleRegisteredLetterStep();
      case TimelineCategory.SEND_ANALOG_DOMICILE:
         return new SendAnalogDomicileStep();
      case TimelineCategory.DIGITAL_FAILURE_WORKFLOW:
        return new DigitalFailureWorkflowStep();
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
