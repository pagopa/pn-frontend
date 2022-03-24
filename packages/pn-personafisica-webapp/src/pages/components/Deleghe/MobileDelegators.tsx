import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { Delegation } from '../../../redux/delegation/types';
import DelegationCard from './DelegationCard';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  return (
    <Box mx={1} mb={8}>
      <h2>{t('deleghe.delegatorsTitle')}</h2>
      <Stack direction="column" mt={4}>
        {delegators.map((delegation: Delegation, i: number) => (
          <DelegationCard key={i} delegation={delegation} type={'delegators'} />
        ))}
      </Stack>
    </Box>
  );
};

export default MobileDelegators;
