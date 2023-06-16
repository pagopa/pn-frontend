import { memo, ReactNode } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

type Props = {
  sectionTitle: string;
  title: ReactNode;
  subtitle: string;
  avatar: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

const DigitalContactsCard = memo(
  ({ sectionTitle, title, subtitle, avatar, children, actions }: Props) => (
    <Card sx={{ padding: 3 }}>
      {avatar && <CardHeader avatar={avatar} sx={{ padding: 0 }} />}
      <CardContent data-testid="DigitalContactsCardBody" sx={{ padding: 0 }}>
        {sectionTitle && (
          <Typography
            color="text.primary"
            fontWeight={700}
            fontSize={14}
            sx={{ textTransform: 'uppercase' }}
          >
            {sectionTitle}
          </Typography>
        )}
        <TitleBox
          sx={{ marginTop: '10px' }}
          variantTitle="h6"
          title={title}
          subTitle={subtitle}
          variantSubTitle={'body1'}
        />
        {children}
      </CardContent>
      {actions && <CardActions data-testid="DigitalContactsCardActions">{actions}</CardActions>}
    </Card>
  )
);

export default DigitalContactsCard;
