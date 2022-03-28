import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, SentimentDissatisfied } from '@mui/icons-material';
import { CardElem, NotificationsCard, OutlinedButton, Row } from '@pagopa-pn/pn-commons';

import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Delegation } from '../../redux/delegation/types';
import * as routes from '../../navigation/routes.const';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { Menu, OrganizationsList } from './DelegationsElements';

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const MobileDelegates = () => {
  const theme = useTheme();
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const cardData: Array<Row> = delegates.map((e: Delegation) => ({
    id: e.mandateId,
    name: `${e.delegate.firstName} ${e.delegate.lastName}`,
    startDate: e.datefrom,
    endDate: e.dateto,
    email: e.email,
    visibilityIds: e.visibilityIds.map((f: any) => f.name),
    status: e.status,
  }));

  const cardHeader: [CardElem, CardElem] = [
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

  const cardBody: Array<CardElem> = [
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
    <Box mx={1} mb={8}>
      <Typography variant="h4" mb={2}>
        {t('deleghe.delegatesTitle')}
      </Typography>
      {delegates.length ? (
        <>
          <Box mb={2}>
            <OutlinedButton onClick={handleAddDelegationClick}>
              <Add fontSize={'small'} sx={{ marginRight: 1 }} />
              {t('deleghe.add')}
            </OutlinedButton>
          </Box>
          <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
        </>
      ) : (
        <StyledStack
          sx={{ fontSize: '16px' }}
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <SentimentDissatisfied
            fontSize={'small'}
            sx={{ verticalAlign: 'middle', margin: '0 20px' }}
          />
          <Typography sx={{ margin: '0 1em', textAlign: 'center' }}>
            {t('deleghe.no_delegates')}
          </Typography>
          <Typography
            sx={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleAddDelegationClick}
          >
            {t('deleghe.add')}
          </Typography>
        </StyledStack>
      )}
    </Box>
  );
};

export default MobileDelegates;
