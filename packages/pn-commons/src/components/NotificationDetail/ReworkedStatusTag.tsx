import { Tag } from '@pagopa/mui-italia';

import { ReworkedStatus } from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

/**
 * @param reworkedStatus if the element has a reworked tag to display
 */

const ReworkedStatusTag = ({ reworkedStatus }: { reworkedStatus?: ReworkedStatus }) => {
  switch (reworkedStatus) {
    case ReworkedStatus.VALID:
      return (
        <Tag
          value={getLocalizedOrDefaultLabel('notifications', 'status.reworked-status-valid')}
          variant="warning"
        />
      );
    case ReworkedStatus.NOT_VALID:
      return (
        <Tag
          value={getLocalizedOrDefaultLabel('notifications', 'status.reworked-status-not-valid')}
          variant="warning"
        />
      );
    default:
      return null;
  }
};

export default ReworkedStatusTag;
