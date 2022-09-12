import { getLocalizedOrDefaultLabel } from '../services/localization.service';
import { ApiKeyStatus } from '../types/ApiKeys';

function localizeStatus(
  status: string,
  defaultLabel: string,
  defaultTooltip: string,
  defaultDescription: string
): {
  label: string;
  tooltip: string;
  description: string;
} {
  return {
    label: getLocalizedOrDefaultLabel('apikeys', `status.${status}`, defaultLabel),
    tooltip: getLocalizedOrDefaultLabel(
      'apikeys',
      `status.${status}-tooltip`,
      defaultTooltip
    ),
    description: getLocalizedOrDefaultLabel(
      'apikeys',
      `status.${status}-description`,
      defaultDescription
    ),
  };
}

export function getApiKeyStatusInfos(status: ApiKeyStatus): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
  description: string;
} {
  switch (status) {
    case ApiKeyStatus.ENABLED:
      return {
        color: 'success',
        ...localizeStatus(
          'enabled',
          'Attiva',
          'L\'API Key è attiva',
          'L\'API Key è attiva'
        ),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...localizeStatus(
          'blocked',
          'Bloccata',
          'L\'API Key è bloccata',
          'L\'API Key è bloccata'
        ),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...localizeStatus(
          'rotated',
          'Ruotata',
          'L\'API Key è ruotata',
          'L\'API Key è ruotata'
        ),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: 'Stato sconosciuto',
        description: 'Stato sconosciuto',
      };
  }
}