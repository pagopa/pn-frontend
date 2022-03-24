import { useTranslation } from 'react-i18next';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

const DigitalContacts = () => {
  const { t } = useTranslation(['recapiti']);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <TitleBox variantTitle="h6" title={t('digital-contacts.title', { ns: 'recapiti' })}/>
        <Typography color="text.primary" fontWeight={700} fontSize={14} sx={{}}>
          {t('digital-contacts.title', { ns: 'recapiti' })}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
};

export default DigitalContacts;
