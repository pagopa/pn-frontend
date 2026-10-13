import { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import UnavailableIcon from '@mui/icons-material/Block';
import ViewedIcon from '@mui/icons-material/DraftsOutlined';
import DeliveredIcon from '@mui/icons-material/MarkEmailReadOutlined';
import WaitingIcon from '@mui/icons-material/Schedule';
import SentIcon from '@mui/icons-material/Send';
import NotDeliveredIcon from '@mui/icons-material/Unsubscribe';
import { SvgIconProps, Typography } from '@mui/material';
import { MIPaper, themeNext } from '@pagopa/mui-italia';

import {
  BffChannelDeliveryStatusV1,
  BffChannelStatusV1,
  BffNotificationChannelType,
} from '../../../generated-client/informal-notifications';
import {
  INFORMAL_CHANNEL_ICON,
  getChannelLabelKey,
} from '../../../utility/informalNotificationTimeline.utility';
import InformalNotificationChannelStatus from './InformalNotificationChannelStatus';
import InformalNotificationChannelStatusList from './InformalNotificationChannelStatusList';

type Props = {
  channelsStatus?: Array<BffChannelDeliveryStatusV1>;
};

type ChannelProps = {
  label: string;
  icon: ReactNode;
};

type StatusProps = {
  label: string;
  icon?: {
    component: ComponentType<SvgIconProps>;
    color: string;
  };
};

const STATUSES_WITH_DESCRIPTION: Set<BffChannelStatusV1> = new Set([
  BffChannelStatusV1.ReadyToSend,
  BffChannelStatusV1.WaitingToSend,
  BffChannelStatusV1.Unavailable,
  BffChannelStatusV1.WorkflowEnded,
]);

const getStatusIconColor = (status: BffChannelStatusV1): string => {
  switch (status) {
    case BffChannelStatusV1.Filed:
    case BffChannelStatusV1.Sent:
    case BffChannelStatusV1.Delivered:
    case BffChannelStatusV1.Viewed:
      return themeNext.colors.success[700];
    default:
      return themeNext.colors.neutral.grey[300];
  }
};

const getStatusIconComponent = (
  status: BffChannelStatusV1
): ComponentType<SvgIconProps> | undefined => {
  switch (status) {
    case BffChannelStatusV1.ReadyToSend:
    case BffChannelStatusV1.WaitingToSend:
      return WaitingIcon;
    case BffChannelStatusV1.Filed:
    case BffChannelStatusV1.Sent:
      return SentIcon;
    case BffChannelStatusV1.Delivered:
      return DeliveredIcon;
    case BffChannelStatusV1.Viewed:
      return ViewedIcon;
    case BffChannelStatusV1.Unavailable:
      return UnavailableIcon;
    case BffChannelStatusV1.NotDelivered:
      return NotDeliveredIcon;
    default:
      return undefined;
  }
};

const InformalNotificationChannelStatusBox = ({ channelsStatus }: Props) => {
  const { t } = useTranslation('campaigns');

  const getChannelPresentation = (channel: BffNotificationChannelType): ChannelProps => {
    const ChannelIcon = INFORMAL_CHANNEL_ICON[channel];

    return {
      label: t(getChannelLabelKey(channel)),
      icon: <ChannelIcon />,
    };
  };

  const getStatusPresentation = (status: BffChannelStatusV1): StatusProps | undefined => {
    if (status === BffChannelStatusV1.WorkflowEnded) {
      return undefined;
    }

    const component = getStatusIconComponent(status);

    return {
      label: t(`informal.detail.send-by-channel.status.${status.toLowerCase()}`),
      icon: component && {
        component,
        color: getStatusIconColor(status),
      },
    };
  };

  const getDescription = (
    channel: BffNotificationChannelType,
    status: BffChannelStatusV1
  ): string | undefined => {
    if (!STATUSES_WITH_DESCRIPTION.has(status)) {
      return undefined;
    }

    const statusLabel = `informal.detail.send-by-channel.description.${status.toLowerCase()}`;

    if (status === BffChannelStatusV1.Unavailable || status === BffChannelStatusV1.WorkflowEnded) {
      return t(`${statusLabel}.${channel.toLowerCase()}`);
    }

    return t(statusLabel);
  };

  if (!channelsStatus?.length) {
    return null;
  }

  return (
    <MIPaper padding={24}>
      <Typography variant="h5" mb={3}>
        {t('informal.detail.send-by-channel.title')}
      </Typography>

      <InformalNotificationChannelStatusList>
        {channelsStatus.map(({ channel, status }) => (
          <InformalNotificationChannelStatus
            key={channel}
            channel={getChannelPresentation(channel)}
            status={getStatusPresentation(status)}
            description={getDescription(channel, status)}
          />
        ))}
      </InformalNotificationChannelStatusList>
    </MIPaper>
  );
};

export default InformalNotificationChannelStatusBox;
