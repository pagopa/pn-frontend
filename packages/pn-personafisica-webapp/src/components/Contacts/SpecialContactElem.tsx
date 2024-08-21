import { useTranslation } from 'react-i18next';

import { Box, Divider, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  addressType: string;
};

const SpecialContactElem: React.FC<Props> = ({ addressType }) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();

  return (
    <>
      <Divider
        sx={{
          backgroundColor: 'white',
          color: 'text.secondary',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      />
      <Typography variant="caption" lineHeight="1.125rem">
        {t(`special-contacts.${addressType.toLowerCase()}-add-more-caption`, { ns: 'recapiti' })}
      </Typography>
      <ButtonNaked
        component={Box}
        onClick={() => {}}
        color="primary"
        size="small"
        sx={{
          verticalAlign: 'unset',
          display: isMobile ? 'block' : 'inline',
          margin: isMobile ? '1rem 0 0 0' : '0 0 0 0.5rem',
        }}
        padding="1rem"
      >
        {t(`special-contacts.${addressType.toLowerCase()}-add-more-button`, { ns: 'recapiti' })}
      </ButtonNaked>
    </>
  );
};

export default SpecialContactElem;
