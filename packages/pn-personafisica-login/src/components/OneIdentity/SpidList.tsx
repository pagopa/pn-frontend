import { useTranslation } from 'react-i18next';

import { Button, Grid, Icon, Skeleton, Typography } from '@mui/material';

import { IDP } from '../../models/IDPS';
import { getConfiguration } from '../../services/configuration.service';
import { shuffleList } from '../../utility/utils';

type Props = {
  idps: Array<IDP>;
  loading: boolean;
  onSelect: (idp: IDP) => void;
};

const SpidList: React.FC<Props> = ({ idps, loading, onSelect }) => {
  const { t } = useTranslation(['login']);
  const { ONE_IDENTITY_CDN_URL } = getConfiguration();

  const shuffledIDPS = shuffleList<IDP>(idps);

  const getImageUrl = (entityID: string) =>
    `${ONE_IDENTITY_CDN_URL}/assets/idps/${btoa(entityID)}.png`;

  if (loading) {
    return (
      <Grid
        data-testid="spid-loader"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 100px)',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100px" height={48} />
        ))}
      </Grid>
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
    <Grid item>
      <Grid container direction="row" justifyItems="center" spacing={2}>
        {shuffledIDPS.map((idp, i) => (
          <Grid
            item
            key={idp.entityID}
            xs={6}
            textAlign={i % 2 === 0 ? 'right' : 'left'}
            sx={{ minWidth: '100px' }}
          >
            <Button
              id={`spid-select-${idp.entityID}`}
              onClick={() => onSelect(idp)}
              sx={{ width: '100px', padding: '0' }}
              aria-label={idp.friendlyName}
            >
              <Icon sx={{ width: '100px', height: '48px' }}>
                <img width="100px" src={getImageUrl(idp.entityID)} alt={idp.friendlyName} />
              </Icon>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default SpidList;
