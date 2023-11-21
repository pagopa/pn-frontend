import { ReactNode } from 'react';

import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';

import { ApiKey, ApiKeyStatus, ApiKeyStatusHistory } from '../models/ApiKeys';
import { GroupStatus, UserGroup } from '../models/user';

function LocalizeStatus(
  status: string,
  history: Array<ApiKeyStatusHistory>,
  translationFunction: any
): {
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  return {
    label: translationFunction(`status.${status}`),
    tooltip: TooltipApiKey(history, translationFunction),
    description: translationFunction(`status.${status}-description`),
  };
}

// eslint-disable-next-line arrow-body-style
export const TooltipApiKey = (history: Array<ApiKeyStatusHistory>, translationFunction: any) => {
  return (
    <Box
      sx={{
        '> .MuiBox-root:not(:last-child)': {
          marginBottom: 1,
        },
      }}
    >
      {history &&
        history.map((h, index) => {
          const output = (p: string, h: ApiKeyStatusHistory) => (
            <Box sx={{ textAlign: 'left' }} key={index}>
              <Box>
                {translationFunction(`tooltip.${p}`)} {formatDate(h.date)}
              </Box>
            </Box>
          );

          const suffixToday = isToday(new Date(h.date)) ? '' : '-in';

          switch (h.status) {
            case ApiKeyStatus.ENABLED:
              return output(`enabled${suffixToday}`, h);
            case ApiKeyStatus.CREATED:
              return output(`created${suffixToday}`, h);
            case ApiKeyStatus.BLOCKED:
              return output(`blocked${suffixToday}`, h);
            case ApiKeyStatus.ROTATED:
              return output(`rotated${suffixToday}`, h);
            default:
              return <></>;
          }
        })}
    </Box>
  );
};

export function getApiKeyStatusInfos(
  status: ApiKeyStatus,
  statusHistory: Array<ApiKeyStatusHistory>,
  translationFunction: any,
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  switch (status) {
    case ApiKeyStatus.ENABLED:
      return {
        color: 'success',
        ...LocalizeStatus('enabled', statusHistory, translationFunction),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...LocalizeStatus('blocked', statusHistory, translationFunction),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...LocalizeStatus('rotated', statusHistory, translationFunction),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: <>Stato sconosciuto</>,
        description: 'Stato sconosciuto',
      };
  }
}

export const apikeysMapper = (
  apikeys: Array<ApiKey<string>>,
  groups: Array<UserGroup>
): Array<ApiKey<UserGroup>> => {
  const getGroup = (group: string): UserGroup =>
    groups.filter((g: UserGroup) => g.name === group)[0];

  const apikeysMapped: Array<ApiKey<UserGroup>> = [];

  apikeys.forEach((apikey) => {
    const mappedGroups = apikey.groups.map(
      (g): UserGroup => ({
        ...(getGroup(g)
          ? getGroup(g)
          : {
              id: 'no-id',
              name: g,
              description: g,
              status: GroupStatus.SUSPENDED,
            }),
      })
    );

    const mappedApikey: ApiKey<UserGroup> = {
      ...apikey,
      groups: mappedGroups,
    };
    // eslint-disable-next-line functional/immutable-data
    apikeysMapped.push(mappedApikey);
  });
  return apikeysMapped;
};
