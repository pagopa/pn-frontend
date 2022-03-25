import { useNavigate } from 'react-router-dom';
import { Box, Stack, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, SentimentDissatisfied } from '@mui/icons-material';
import { OutlinedButton } from '@pagopa-pn/pn-commons';

import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Delegation } from '../../redux/delegation/types';
import * as routes from '../../navigation/routes.const';
import DelegationCard from './DelegationCard';

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

  const handleAddDelegationClick = () => {
    navigate(routes.NUOVA_DELEGA);
  };

  return (
    <Box mx={1} mb={8}>
      <h2>{t('deleghe.delegatesTitle')}</h2>
      {delegates.length ? (
        <>
          <OutlinedButton onClick={handleAddDelegationClick}>
            <Add fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </OutlinedButton>
          <Stack direction="column" mt={4}>
            {delegates.map((delegation: Delegation, i: number) => (
              <DelegationCard key={i} delegation={delegation} type={'delegates'} />
            ))}
          </Stack>
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
            style={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold' }}
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
