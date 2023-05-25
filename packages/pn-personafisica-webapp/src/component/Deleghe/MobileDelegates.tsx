import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  CardElement,
  ItemsCard,
  Item,
  CodeModal,
  EmptyState,
  ApiErrorWrapper,
} from '@pagopa-pn/pn-commons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { DELEGATION_ACTIONS, getDelegates } from '../../redux/delegation/actions';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { Menu, OrganizationsList } from './DelegationsElements';

const MobileDelegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );
  const [showCodeModal, setShowCodeModal] = useState({ open: false, name: '', code: '' });

  const cardData: Array<Item> = delegationToItem(delegates);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'status',
      label: t('deleghe.table.status'),
      getLabel(value: string) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        return <Chip label={label} color={color} />;
      },
      gridProps: {
        xs: 8,
      },
    },
    {
      id: 'id',
      label: '',
      getLabel(value: string, row: Item) {
        return (
          <Menu
            menuType={'delegates'}
            id={value}
            verificationCode={row.verificationCode}
            name={row.name}
            setCodeModal={setShowCodeModal}
          />
        );
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

  const handleAddDelegationClick = (source: string) => {
    navigate(routes.NUOVA_DELEGA);
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_CTA, { source });
  };

  const handleCloseShowCodeModal = () => {
    setShowCodeModal({ open: false, name: '', code: '' });
  };

  return (
    <>
      <CodeModal
        title={t('deleghe.show_code_title', { name: showCodeModal.name })}
        subtitle={t('deleghe.show_code_subtitle')}
        open={showCodeModal.open}
        initialValues={showCodeModal.code.split('')}
        cancelCallback={handleCloseShowCodeModal}
        cancelLabel={t('deleghe.close')}
        codeSectionTitle={t('deleghe.verification_code')}
        isReadOnly
      />
      <Box>
        <Typography variant="h4" mb={3}>
          {t('deleghe.delegatesTitle')}
        </Typography>
        <Box mb={2}>
          <Button
            variant="outlined"
            onClick={(_e, source = 'default') => handleAddDelegationClick(source)}
            sx={{ mb: 1 }}
          >
            <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </Button>
        </Box>
        <ApiErrorWrapper
          apiId={DELEGATION_ACTIONS.GET_DELEGATES}
          reloadAction={() => dispatch(getDelegates())}
        >
          {cardData.length ? (
            <ItemsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
          ) : (
            <EmptyState
              emptyActionCallback={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
              emptyMessage={t('deleghe.no_delegates')}
              emptyActionLabel={t('deleghe.add')}
            />
          )}
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default MobileDelegates;
