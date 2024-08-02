import { ReactNode } from 'react';

import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

type Props = {
  sectionTitle: string;
  title: ReactNode;
  subtitle: string;
  avatar: ReactNode;
  children: ReactNode;
};

const DigitalContactsCard: React.FC<Props> = ({
  sectionTitle,
  title,
  subtitle,
  avatar,
  children,
}) => (
  <Card sx={{ p: 3 }}>
    {avatar && <CardHeader sx={{ p: 0 }} avatar={avatar} />}
    <CardContent data-testid="DigitalContactsCardBody" sx={{ p: 0 }}>
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
  </Card>
);
export default DigitalContactsCard;
