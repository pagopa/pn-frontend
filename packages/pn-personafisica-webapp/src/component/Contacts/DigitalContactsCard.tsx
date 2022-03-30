import { ReactNode } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

type Props = {
  sectionTitle: string;
  title: string;
  subtitle: string;
  avatar: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

const DigitalContactsCard = ({
  sectionTitle,
  title,
  subtitle,
  avatar,
  children,
  actions,
}: Props) => (
  <Card>
    <CardHeader avatar={avatar} />
    <CardContent data-testid="DigitalContactsCardBody">
      <Typography
        color="text.primary"
        fontWeight={700}
        fontSize={14}
        sx={{ textTransform: 'uppercase' }}
      >
        {sectionTitle}
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
    <CardActions data-testid="DigitalContactsCardActions">{actions}</CardActions>
  </Card>
);

export default DigitalContactsCard;
