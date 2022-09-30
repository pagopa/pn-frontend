import { compileRoute } from "@pagopa-pn/pn-commons";
import { GroupStatus } from "../../models/user";

const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';
const API_NOTIFICATIONS_PA = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_NOTIFICATIONS_GROUPS = 'groups';
const API_NOTIFICATION_USER_GROUPS_PATH = `${API_NOTIFICATIONS_PA}/${API_VERSION_SEGMENT}/${API_NOTIFICATIONS_GROUPS}`;
const API_NOTIFICATIONS_STATUS_FILTER_PARAMETER = 'statusFilter';

export function GET_USER_GROUPS(status?: GroupStatus) {
  return compileRoute({
    prefix: API_EXTERNAL_REGISTRY_PREFIX,
    path: API_NOTIFICATION_USER_GROUPS_PATH,
    query: {
      [API_NOTIFICATIONS_STATUS_FILTER_PARAMETER]: status || ''
    },
  });
}