import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EmptyState, ApiErrorWrapper, useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppDispatch } from '../../redux/hooks';
import * as routes from '../../navigation/routes.const';
import { DELEGATION_ACTIONS, getDelegates } from '../../redux/delegation/actions';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';

const DelegatesByCompany = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddDelegationClick = (source: string) => {
    navigate(routes.NUOVA_DELEGA);
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_CTA, { source });
  };

  return (
    <Box mb={8}>
      <Stack
        mb={4}
        direction={isMobile ? 'column' : 'row'}
        justifyContent={'space-between'}
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        <Typography variant="h5" mb={3}>
          {t('deleghe.delegatesTitle')}
        </Typography>
        <Button
          variant="outlined"
          onClick={(_e, source = 'default') => handleAddDelegationClick(source)}
          data-testid="addDeleghe"
        >
          <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
          {t('deleghe.add')}
        </Button>
      </Stack>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_DELEGATES}
        reloadAction={() => dispatch(getDelegates())}
      >
        <EmptyState
          emptyActionLabel={t('deleghe.add') as string}
          emptyMessage={t('deleghe.no_delegates') as string}
          emptyActionCallback={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
        />
      </ApiErrorWrapper>
    </Box>
  );
};

export default DelegatesByCompany;
