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
    <Card>
      {avatar && <CardHeader sx={{ px: 3, pt: 4, pb: 1 }} avatar={avatar} />}
      <CardContent data-testid="DigitalContactsCardBody">
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
          variantTitle="h4"
          title={title}
          subTitle={subtitle}
          variantSubTitle={'body1'}
        />
        {children}
      </CardContent>
      {actions &&
        <CardActions data-testid="DigitalContactsCardActions">{actions}</CardActions>
      }
    </Card>
  )
);

export default DigitalContactsCard;
