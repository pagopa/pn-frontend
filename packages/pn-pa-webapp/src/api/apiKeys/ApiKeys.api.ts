import { GroupStatus, UserGroup } from "../../models/user";
import { apiClient } from "../axios";
import { GET_USER_GROUPS } from "./apiKeys.routes";

export const ApiKeysApi = {
  /**
   * get user groups
   * @param  {GroupStatus} status
   * @returns Promise
   */
   getUserGroups: (status?: GroupStatus): Promise<Array<UserGroup>> =>
   apiClient.get<Array<UserGroup>>(GET_USER_GROUPS(status)).then((response) => response.data)
};