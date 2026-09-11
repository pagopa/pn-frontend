import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import { campaignDetailMock } from '../__mocks__/CampaignDetail.mock';
import PnCampaignDetailCard from '../components/Campaigns/PnCampaignDetailCard';
import * as routes from '../navigation/routes.const';

const CampaignDetail = () => {
  const navigate = useNavigate();
  const campaign = campaignDetailMock;

  const breadcrumb = (
    <MIBreadcrumbs backButtonLabel="Indietro" backButtonAction={() => navigate(routes.DASHBOARD)}>
      <MIBreadcrumbItem
        label="Campagne"
        onClick={() => navigate(routes.DASHBOARD)}
        data-testid="breadcrumb-root-button"
      />
      <MIBreadcrumbItem label={campaign.title} current />
    </MIBreadcrumbs>
  );

  return (
    <Box
      sx={{ p: 3, display: 'flex', flexDirection: 'column', backgroundColor: 'grey.100' }}
      gap={3}
    >
      {breadcrumb}

      <TitleBox
        title={campaign.title}
        subTitle={campaign.description}
        mbTitle={1}
        variantSubTitle="body1"
      />

      <PnCampaignDetailCard
        creationDate="10/07/2026"
        campaignId={campaign.campaignId}
        serviceName={campaign.serviceName}
        channels={campaign.channels.join(' · ')}
      />

      {/*       <DesktopNotifications
        notifications={notifications}
        // onChangeSorting={handleChangeSorting} // Riabilitare con la issue PN-1124
        onManualSend={handleRouteManualSend}
        onApiKeys={handleRouteApiKeys}
        filtersApplied={filterNotificationsRef.current.filtersApplied}
        onCleanFilters={filterNotificationsRef.current.cleanFilters}
        hasTimeoutError={hasTimeoutError}
        loading={loading}
        onRetry={fetchNotifications}
      /> */}
    </Box>
  );
};

export default CampaignDetail;
