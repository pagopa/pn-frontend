import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CardElement,
  EmptyState,
  KnownSentiment,
  PnCard,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderItem,
  PnCardsList,
  Row,
} from '@pagopa-pn/pn-commons';

import { DelegationColumnData, DelegationData } from '../../models/Deleghe';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import DelegatorsDataSwitch from './DelegationDataSwitch';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const cardData: Array<Row<DelegationData>> = delegationToItem(delegators);

  const cardBody: Array<CardElement<DelegationColumnData>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      wrapValueInTypography: false,
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      wrapValueInTypography: false,
    },
  ];

  return (
    <Box data-testid="mobile-delegators-wrapper">
      <Typography variant="h4" mb={3}>
        {t('deleghe.delegatorsTitle')}
      </Typography>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_DELEGATORS}
        reloadAction={() => dispatch(getDelegators())}
      >
        {delegators.length > 0 ? (
          <PnCardsList>
            {cardData.map((data) => (
              <PnCard key={data.id} testId="mobileDelegatorsCards">
                <PnCardHeader
                  headerGridProps={{
                    direction: { xs: 'row', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <PnCardHeaderItem
                    position="left"
                    gridProps={{
                      xs: 8,
                    }}
                  >
                    <DelegatorsDataSwitch data={data} type="status" menuType="delegators" />
                  </PnCardHeaderItem>
                  <PnCardHeaderItem
                    position="right"
                    gridProps={{
                      xs: 4,
                    }}
                  >
                    <DelegatorsDataSwitch data={data} type="menu" menuType="delegators" />
                  </PnCardHeaderItem>
                </PnCardHeader>
                <PnCardContent>
                  {cardBody.map((body) => (
                    <PnCardContentItem
                      key={body.id}
                      label={body.label}
                      wrapValueInTypography={body.wrapValueInTypography}
                    >
                      <DelegatorsDataSwitch data={data} type={body.id} menuType="delegators" />
                    </PnCardContentItem>
                  ))}
                </PnCardContent>
              </PnCard>
            ))}
          </PnCardsList>
        ) : (
          <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('deleghe.no_delegators')}</EmptyState>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default MobileDelegators;
