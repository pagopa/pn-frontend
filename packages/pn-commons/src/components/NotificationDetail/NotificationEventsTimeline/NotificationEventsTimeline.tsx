import { Fragment, useMemo, useState } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { NotificationStatus } from '../../../models';
import {
  DigitalDomicileType,
  LegalFactId,
  NotificationDetailRecipient,
  ResponseStatus,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
} from '../../../models/NotificationDetail';
import {
  Delegator,
  NotificationTimelineEvent,
  NotificationTimelineLegacyStatusHistory,
  NotificationTimelineStatusHistory,
} from '../../../models/NotificationTimeline';
import { getRecIndex } from '../../../utility/notification.utility';
import {
  emptyLegalFactPlan,
  getStatusLegalFactPlan,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../../../utility/notificationTimeline.utility';
import ReworkedStatusTag from '../ReworkedStatusTag';
import NotificationTimelineDescription from './NotificationTimelineDescription';
import NotificationTimelineEventItem, {
  isLegalFactsOnlyEvent,
} from './NotificationTimelineEventItem';
import NotificationTimelineGroupItem from './NotificationTimelineGroupItem';
import TimelineExpandAllButton from './TimelineExpandAllButton';
import { getMultiAttemptGroupIds } from './timelineGroupHeader.config';
import { PERFECTION_ANCHORS, getTimelineItems } from './timelineItem.config';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationTimelineStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isSenderTimeline?: boolean;
  language?: string;
  isNewTimelineCopyEnabled?: boolean;
  perfectionLink?: string;
  mandateId?: string;
  delegator?: Delegator;
  userTaxId?: string;
};

const getPerfectionLink = (
  perfectionLink: string | undefined,
  history: Array<NotificationTimelineLegacyStatusHistory>,
  recipients: Array<NotificationDetailRecipient>,
  userTaxId?: string,
  delegator?: Delegator,
  isSender?: boolean
  // eslint-disable-next-line sonarjs/cognitive-complexity
): string | undefined => {
  if (!perfectionLink) {
    return perfectionLink;
  }

  // if notification is a multi recipient notification and we are inthe sender view, we cannot known what is the perfection link,
  // because each recipient can recive the notification in different ways
  if (recipients.length > 1 && isSender) {
    return undefined;
  }

  // get the recipientIndex
  // if we are in the sender view, we are in a single recipient notification due to the previous if,
  // otherwise we are in recipient view and we have to get the recIndex because we can be in the multi-recipient scenario
  const recIndex = isSender ? 0 : getRecIndex(recipients, userTaxId, delegator);

  const steps = history.reduce<Array<NotificationTimelineEvent>>(
    (arr, status) => arr.concat(status.steps ?? []),
    []
  );

  const digitalSuccess = steps.find(
    (step) =>
      step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW &&
      step.details.recIndex === recIndex
  );
  if (digitalSuccess) {
    const digitalAddress = (digitalSuccess?.details as SendDigitalDetails | undefined)
      ?.digitalAddress;
    if (digitalAddress?.type === DigitalDomicileType.PEC) {
      return `${perfectionLink}${PERFECTION_ANCHORS.PEC}`;
    }
    if (digitalAddress?.type === DigitalDomicileType.SERCQ) {
      return `${perfectionLink}${PERFECTION_ANCHORS.SEND}`;
    }
  }

  // if there is a digital failure, the notification is still a digital notification
  const digitalFailure = steps.some(
    (step) =>
      step.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW &&
      step.details.recIndex === recIndex
  );

  if (digitalFailure) {
    return `${perfectionLink}${PERFECTION_ANCHORS.PEC}`;
  }

  // ANALOG_SUCCESS_WORKFLOW is not returned by the bff, so we have to check the presence of SEND_ANALOG_FEEDBACK and status OK
  const analogDelivery = steps.some(
    (step) =>
      ((step.category === TimelineCategory.SEND_ANALOG_FEEDBACK &&
        (step.details as SendPaperDetails).responseStatus === ResponseStatus.OK) ||
        step.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW) &&
      step.details.recIndex === recIndex
  );
  if (analogDelivery) {
    return `${perfectionLink}${PERFECTION_ANCHORS.ANALOG}`;
  }

  return perfectionLink;
};

// The same group can be shown in more than one status: its expanded state is tracked per status
const getGroupKey = (status: NotificationTimelineStatusHistory, groupId: string) =>
  `${status.status}_${groupId}`;

const NotificationEventsTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  disableDownloads = false,
  isSenderTimeline,
  language = 'it',
  isNewTimelineCopyEnabled = false,
  perfectionLink,
  mandateId,
  delegator,
  userTaxId,
}: Props) => {
  const legacyStatusHistory = useMemo(() => toLegacyStatusHistory(statusHistory), [statusHistory]);
  const multiAttemptGroupIds = useMemo(
    () => getMultiAttemptGroupIds(statusHistory),
    [statusHistory]
  );
  const timelineItems = useMemo(
    () =>
      getTimelineItems(
        statusHistory,
        legacyStatusHistory,
        recipients,
        userTaxId,
        isSenderTimeline,
        delegator && mandateId
          ? {
              mandateId,
              delegatorName: delegator?.displayName,
              delegatorTaxId: delegator?.fiscalCode,
            }
          : undefined
      ),
    [
      statusHistory,
      legacyStatusHistory,
      recipients,
      isSenderTimeline,
      language,
      mandateId,
      delegator,
      userTaxId,
    ]
  );

  const isMobile = useIsMobile('sm');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupKey: string) =>
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (!next.delete(groupKey)) {
        next.add(groupKey);
      }
      return next;
    });

  const setGroupsExpanded = (groupKeys: Array<string>, expanded: boolean) =>
    setExpandedGroups((current) => {
      const next = new Set(current);
      groupKeys.forEach((key) => (expanded ? next.add(key) : next.delete(key)));
      return next;
    });

  const statusPerfectionLink = useMemo(
    () =>
      isNewTimelineCopyEnabled
        ? getPerfectionLink(
            perfectionLink,
            legacyStatusHistory,
            recipients,
            userTaxId,
            delegator,
            isSenderTimeline
          )
        : perfectionLink,
    [legacyStatusHistory, recipients]
  );

  return (
    <Box data-testid="NotificationEventsTimeline">
      <MITimeline>
        {timelineItems.map(
          ({ status, label, description, icon, variant, legacyStatus, recipientPerStep }) => {
            // Single decision point for the whole status: which legal fact goes inline in the
            // description and which events must therefore be skipped. The new copy is the only
            // mode that inlines legal facts, hence the flag is checked once, here.
            const plan = isNewTimelineCopyEnabled
              ? getStatusLegalFactPlan(legacyStatus, (event) => event.isHidden)
              : emptyLegalFactPlan<NotificationTimelineEvent>();

            // Absorbed events are dropped before rendering, so that no recipient header is
            // emitted for an event that will not be displayed. The original index is kept to
            // stay aligned with recipientPerStep.
            const visibleSteps = status.steps
              .map((step, stepIndex) => ({ step, stepIndex }))
              .filter(
                ({ step }) =>
                  isTimelineGroupStep(step) || !plan.hiddenEventIds.has(step.event.elementId)
              );

            const groupKeys = visibleSteps.flatMap(({ step }) =>
              isTimelineGroupStep(step) ? [getGroupKey(status, step.group.groupId)] : []
            );
            const allExpanded =
              groupKeys.length > 0 && groupKeys.every((key) => expandedGroups.has(key));
            const showExpandAll =
              !isMobile && status.status === NotificationStatus.DELIVERING && groupKeys.length > 1;

            return (
              <MITimelineItem
                key={`timeline_step_${status.status}_${status.activeFrom}`}
                icon={icon}
                variant={variant}
                title={
                  <Stack
                    component="span"
                    direction={{ xs: 'column-reverse', sm: 'row' }}
                    fontWeight={600}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    fontSize="16px"
                    gap={{ xs: 0.5, sm: 1 }}
                    width="100%"
                  >
                    {label}
                    <ReworkedStatusTag reworkedStatus={status.reworkedStatus} />
                    {showExpandAll && (
                      <TimelineExpandAllButton
                        allExpanded={allExpanded}
                        onClick={() => setGroupsExpanded(groupKeys, !allExpanded)}
                      />
                    )}
                  </Stack>
                }
              >
                <Stack gap={1.5} alignItems="flex-start">
                  {status.status !== NotificationStatus.DELIVERING && (
                    <NotificationTimelineDescription
                      description={description}
                      date={status.activeFrom}
                      language={language}
                      clickHandler={clickHandler}
                      slotProps={{
                        typography: { sx: { fontSize: '14px', fontWeight: 400 } },
                        button: { sx: { fontSize: '14px' } },
                      }}
                      disableDownloads={disableDownloads}
                      isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                      legalFacts={plan.legalFacts.length === 1 ? plan.legalFacts : []}
                      perfectionLink={statusPerfectionLink}
                    />
                  )}

                  {visibleSteps.map(({ step, stepIndex }) => {
                    const recipient = recipientPerStep[stepIndex];
                    const recipientHeader = recipient && (
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        data-testid="timeline-group-recipient"
                        mt={2}
                        sx={{ color: '#555C70' }}
                      >
                        {`${recipient.denomination} - ${recipient.taxId}`}
                      </Typography>
                    );

                    if (!isTimelineGroupStep(step)) {
                      const eventItem = (
                        <NotificationTimelineEventItem
                          event={step.event}
                          allEvents={legacyStatus.steps}
                          recipients={recipients}
                          clickHandler={clickHandler}
                          disableDownloads={disableDownloads}
                          language={language}
                          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                          perfectionLink={perfectionLink}
                          delegator={delegator}
                        />
                      );

                      return (
                        <Fragment key={step.event.elementId}>
                          {recipientHeader}
                          {isLegalFactsOnlyEvent(step.event, isNewTimelineCopyEnabled) ? (
                            eventItem
                          ) : (
                            <Box component="ul" sx={{ listStyleType: 'disc', pl: 3, m: 0 }}>
                              {eventItem}
                            </Box>
                          )}
                        </Fragment>
                      );
                    }

                    const previousStep = status.steps[stepIndex - 1];
                    const hasPreviousGroup = !!previousStep && isTimelineGroupStep(previousStep);

                    return (
                      <Fragment key={step.group.groupId}>
                        {hasPreviousGroup && (
                          <Divider flexItem data-testid="timeline-group-divider" />
                        )}

                        {recipientHeader}

                        <NotificationTimelineGroupItem
                          group={step.group}
                          allEvents={legacyStatus.steps}
                          recipients={recipients}
                          clickHandler={clickHandler}
                          disableDownloads={disableDownloads}
                          language={language}
                          hasMultipleAttempts={multiAttemptGroupIds.has(step.group.groupId)}
                          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
                          perfectionLink={perfectionLink}
                          delegator={delegator}
                          expanded={expandedGroups.has(getGroupKey(status, step.group.groupId))}
                          onToggle={() => toggleGroup(getGroupKey(status, step.group.groupId))}
                        />
                      </Fragment>
                    );
                  })}
                </Stack>
              </MITimelineItem>
            );
          }
        )}
      </MITimeline>
    </Box>
  );
};

export default NotificationEventsTimeline;
