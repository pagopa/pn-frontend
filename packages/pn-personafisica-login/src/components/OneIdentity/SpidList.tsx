import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, List, ListItemButton, Skeleton, Typography } from '@mui/material';

import { IDP } from '../../models/IDPS';
import { getConfiguration } from '../../services/configuration.service';
import { shuffleList } from '../../utility/utils';

type Props = {
  idps: Array<IDP>;
  loading: boolean;
  authorizingEntityId: string | null;
  onSelect: (idp: IDP) => void;
};

const SpidList: React.FC<Props> = ({ idps, loading, authorizingEntityId, onSelect }) => {
  const { t } = useTranslation(['login']);
  const { ONE_IDENTITY_CDN_URL } = getConfiguration();

  const shuffledIDPS = useMemo(() => shuffleList<IDP>(idps), [idps]);

  const getImageUrl = (entityID: string) =>
    `${ONE_IDENTITY_CDN_URL}/assets/idps/${btoa(entityID)}.png`;

  if (loading) {
    return (
      <List data-testid="spid-loader">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={60}
            sx={{
              borderRadius: '8px',
              mb: 2,
            }}
          />
        ))}
      </List>
    );
  }

  if (!idps.length) {
    return (
      <Typography variant="body2" data-testid="idp-empty-state">
        {t('spidSelect.emptyState')}
      </Typography>
    );
  }

  return (
    <List>
      {shuffledIDPS.map((idp) => (
        <ListItemButton
          id={`spid-select-${idp.entityID}`}
          key={idp.entityID}
          onClick={() => onSelect(idp)}
          disabled={authorizingEntityId !== null}
          sx={{
            justifyContent: 'space-between',
            height: '60px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            mb: 2,
            p: 2,
          }}
          aria-label={idp.friendlyName}
        >
          <Box display="flex" alignItems="center" gap={2} minWidth={0} sx={{ overflow: 'hidden' }}>
            {authorizingEntityId === idp.entityID && <CircularProgress size={24} />}
            <Typography fontSize="14px" fontWeight="500" noWrap sx={{ color: '#555C70' }}>
              {idp.friendlyName}
            </Typography>
          </Box>
          <img height="100%" src={getImageUrl(idp.entityID)} alt={idp.friendlyName} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default SpidList;
