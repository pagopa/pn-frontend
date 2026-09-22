import { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import UnavailableIcon from '@mui/icons-material/Block';
import SmsChannelIcon from '@mui/icons-material/ChatOutlined';
import ViewedIcon from '@mui/icons-material/DraftsOutlined';
import EmailChannelIcon from '@mui/icons-material/MailOutline';
import DeliveredIcon from '@mui/icons-material/MarkEmailReadOutlined';
import PecChannelIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import AnalogChannelIcon from '@mui/icons-material/MarkunreadMailboxOutlined';
import WaitingIcon from '@mui/icons-material/Schedule';
import SentIcon from '@mui/icons-material/Send';
import NotDeliveredIcon from '@mui/icons-material/Unsubscribe';
import { Box, SvgIconProps, Typography } from '@mui/material';
import SendIcon from '@pagopa-pn/pn-commons/src/components/Icons/SendIcon';
import { LogoIOApp, MIPaper, themeNext } from '@pagopa/mui-italia';

import {
  BffChannelDeliveryStatusV1,
  BffChannelStatusV1,
  BffNotificationChannelType,
} from '../../../generated-client/informal-notifications';
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
  'READY_TO_SEND',
  'WAITING_TO_SEND',
  'UNAVAILABLE',
  'WORKFLOW_ENDED',
]);

const CHANNEL_ICONS_MAP: Record<BffNotificationChannelType, ReactNode> = {
  SEND: <SendIcon />,
  IO: <LogoIOApp title="AppIoLogo" color="blue500" size={24} />,
  SMS: <SmsChannelIcon />,
  EMAIL: <EmailChannelIcon />,
  ANALOG: <AnalogChannelIcon />,
  PEC: <PecChannelIcon />,
};

const getStatusIconColor = (status: BffChannelStatusV1): string => {
  switch (status) {
    case 'FILED':
    case 'SENT':
    case 'DELIVERED':
    case 'VIEWED':
      return themeNext.colors.success[700];
    default:
      return themeNext.colors.neutral.grey[300];
  }
};

const getStatusIconComponent = (
  status: BffChannelStatusV1
): ComponentType<SvgIconProps> | undefined => {
  switch (status) {
    case 'READY_TO_SEND':
    case 'WAITING_TO_SEND':
      return WaitingIcon;
    case 'FILED':
    case 'SENT':
      return SentIcon;
    case 'DELIVERED':
      return DeliveredIcon;
    case 'VIEWED':
      return ViewedIcon;
    case 'UNAVAILABLE':
      return UnavailableIcon;
    case 'NOT_DELIVERED':
      return NotDeliveredIcon;
    default:
      return undefined;
  }
};

const InformalNotificationChannelStatusBox = ({ channelsStatus }: Props) => {
  const { t } = useTranslation('campaigns');

  const getChannelPresentation = (channel: BffNotificationChannelType): ChannelProps => ({
    label: t(`informal.detail.send-by-channel.channel.${channel.toLowerCase()}`),
    icon: CHANNEL_ICONS_MAP[channel],
  });

  const getStatusPresentation = (status: BffChannelStatusV1): StatusProps | undefined => {
    if (status === 'WORKFLOW_ENDED') {
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

    if (status === 'UNAVAILABLE' || status === 'WORKFLOW_ENDED') {
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
          <Box component="li" key={channel}>
            <InformalNotificationChannelStatus
              channel={getChannelPresentation(channel)}
              status={getStatusPresentation(status)}
              description={getDescription(channel, status)}
            />
          </Box>
        ))}
      </InformalNotificationChannelStatusList>
    </MIPaper>
  );
};

export default InformalNotificationChannelStatusBox;
