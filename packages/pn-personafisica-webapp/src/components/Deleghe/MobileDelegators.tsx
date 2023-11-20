import { useTranslation } from 'react-i18next';

import { Box, Chip, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CardElement,
  EmptyState,
  Item,
  KnownSentiment,
  PnCard,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderTitle,
  PnCardsList,
} from '@pagopa-pn/pn-commons';

import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import { DelegationStatus, getDelegationStatusKeyAndColor } from '../../utility/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const cardData: Array<Item> = delegationToItem(delegators);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'status',
      label: t('deleghe.table.status'),
      getLabel(value: string, row: Item) {
        const { color, key } = getDelegationStatusKeyAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={t(key)} color={color} />;
        } else {
          return <AcceptButton id={row.id} name={row.name as string} />;
        }
      },
      gridProps: {
        xs: 8,
      },
    },
    {
      id: 'id',
      label: '',
      getLabel(value: string) {
        return <Menu menuType={'delegators'} id={value} />;
      },
      gridProps: {
        xs: 4,
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      getLabel(value: string) {
        return <b>{value}</b>;
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      getLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} textVariant="body2" visibleItems={3} />;
      },
      notWrappedInTypography: true,
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
              <PnCard key={data.id}>
                <PnCardHeader>
                  <PnCardHeaderTitle
                    cardHeader={cardHeader}
                    item={data}
                    headerGridProps={{
                      direction: { xs: 'row', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                  />
                </PnCardHeader>
                <PnCardContent>
                  {cardBody.map((body) => (
                    <PnCardContentItem key={body.id} body={body}>
                      {body.getLabel(data[body.id], data)}
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
