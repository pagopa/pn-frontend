import React from 'react';

import { MIAlert } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  downtimeExampleLink: string;
};

const DowntimeLanguageBanner: React.FC<Props> = ({ downtimeExampleLink }) => (
  <MIAlert
    severity="info"
    description={getLocalizedOrDefaultLabel('common', 'downtime_language_banner.message')}
    data-testid="downtimeLanguageBanner"
    sx={{ mt: 2 }}
    action={{
      label: getLocalizedOrDefaultLabel('common', 'downtime_language_banner.link'),
      href: downtimeExampleLink,
      rel: 'noopener noreferrer',
      target: '_blank',
    }}
  />
);

export default DowntimeLanguageBanner;
