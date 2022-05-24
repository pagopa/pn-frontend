import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { CardElement, ItemsCard, Item } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import TableError from '../TableError/TableError';
import { getDelegates } from '../../redux/delegation/actions';
import { Menu, OrganizationsList } from './DelegationsElements';

const MobileDelegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );
  const delegatesError = useAppSelector(
    (state: RootState) => state.delegationsState.delegatesError
  );

  const cardData: Array<Item> = delegationToItem(delegates);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'status',
      label: t('deleghe.table.status'),
      getLabel(value: string) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        return <Chip label={label} color={color} />;
      },
    },
    {
      id: 'id',
      label: '',
      getLabel(value: string) {
        return <Menu menuType={'delegates'} id={value} />;
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
      id: 'email',
      label: t('deleghe.table.email'),
      getLabel(value: string) {
        return value;
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
        return <OrganizationsList organizations={value} />;
      },
    },
  ];

  const handleAddDelegationClick = () => {
    navigate(routes.NUOVA_DELEGA);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {t('deleghe.delegatesTitle')}
      </Typography>
      {delegatesError && <TableError onClick={() => dispatch(getDelegates())} />}
      {!delegatesError && (
        <>
          <Box mb={2}>
            <Button variant="outlined" onClick={handleAddDelegationClick}>
              <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
              {t('deleghe.add')}
            </Button>
          </Box>
          <ItemsCard
            cardHeader={cardHeader}
            cardBody={cardBody}
            cardData={cardData}
            emptyActionCallback={handleAddDelegationClick}
            emptyMessage={t('deleghe.no_delegates') as string}
            emptyActionLabel={t('deleghe.add') as string}
          />
        </>
      )}
    </Box>
  );
};

export default MobileDelegates;
