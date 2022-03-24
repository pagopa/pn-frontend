import { useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add } from '@mui/icons-material';
import { OutlinedButton } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Delegation } from '../../redux/delegation/types';
import * as routes from '../../navigation/routes.const';
import DelegationCard from './DelegationCard';

const MobileDelegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const handleAddDelegationClick = () => {
    navigate(routes.NUOVA_DELEGA);
  };

  return (
    <Box mx={1} mb={8}>
      <h2>{t('deleghe.delegatesTitle')}</h2>
      <OutlinedButton onClick={handleAddDelegationClick}>
        <Add fontSize={'small'} sx={{ marginRight: 1 }} />
        {t('deleghe.add')}
      </OutlinedButton>
      <Stack direction="column" mt={4}>
        {delegates.map((delegation: Delegation, i: number) => (
          <DelegationCard key={i} delegation={delegation} type={'delegates'} />
        ))}
      </Stack>
    </Box>
  );
};

export default MobileDelegates;
