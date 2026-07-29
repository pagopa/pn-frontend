import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import {
  INotificationDetailTimeline,
  NotificationDetail,
  TimelineCategory,
  useHasPermissions,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

import { PAEventsType } from '../../models/PAEventsType';
import { PNRole } from '../../models/user';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PAEventStrategyFactory from '../../utility/MixpanelUtils/PAEventStrategyFactory';
import ConfirmCancellationDialog from './ConfirmCancellationDialog';

type Props = {
  notification: NotificationDetail;
  onCancelNotification: () => void;
};

const NotificationCancellationAction: React.FC<Props> = ({
  notification,
  onCancelNotification,
}) => {
  const { t } = useTranslation(['notifiche']);
  const [showModal, setShowModal] = useState(false);
  const { cancellationInProgress, cancelled } = useIsCancelled({ notification });

  const withPayment =
    notification.timeline.findIndex(
      (el: INotificationDetailTimeline) => el.category === TimelineCategory.PAYMENT
    ) > -1;

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const openModal = () => {
    PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_CANCEL_NOTIFICATION);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalCloseAndProceed = () => {
    setShowModal(false);
    if (userHasAdminPermissions) {
      onCancelNotification();
    }
  };

  if (cancellationInProgress || cancelled || !userHasAdminPermissions) {
    return null;
  }

  return (
    <Box>
      <MIButton
        variant="outlined"
        color="error"
        onClick={openModal}
        data-testid="cancelNotificationBtn"
      >
        {t('detail.cancel-notification', { ns: 'notifiche' })}
      </MIButton>
      <ConfirmCancellationDialog
        onClose={handleModalClose}
        onConfirm={handleModalCloseAndProceed}
        payment={withPayment}
        showModal={showModal}
      />
    </Box>
  );
};

export default NotificationCancellationAction;
