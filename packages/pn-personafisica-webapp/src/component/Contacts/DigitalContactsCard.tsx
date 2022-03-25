import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography
} from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import { DigitalContactsIcon } from './Icons';


type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
};

const DigitalContactsCard = ({title, subtitle, children, actions}: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <Card>
      <CardHeader
        avatar={<DigitalContactsIcon sx={{ width: '60px', height: '60px' }} color="secondary" />}
      />
      <CardContent>
        <Typography
          color="text.primary"
          fontWeight={700}
          fontSize={14}
          sx={{ textTransform: 'uppercase' }}
        >
          {t('digital-contacts.title', { ns: 'recapiti' })}
        </Typography>
        <TitleBox
          sx={{ marginTop: '10px' }}
          variantTitle="h4"
          title={title}
          subTitle={subtitle}
          variantSubTitle={'body1'}
        />
        {children}
      </CardContent>
      <CardActions>
        {actions}
      </CardActions>
    </Card>
  );
};

export default DigitalContactsCard;
