import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NewApiKeyBE } from '../../models/ApiKeys';
import { UserGroup, GroupStatus } from '../../models/user';

export const saveNewApiKey = createAsyncThunk<string, NewApiKeyBE>(
  'saveNewApiKey',
  performThunkAction((param: NewApiKeyBE) => ApiKeysApi.createNewApiKey(param))
);

export const getApiKeyUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  'getApiKeyUserGroups',
  performThunkAction((status: GroupStatus | undefined) => NotificationsApi.getUserGroups(status))
);
