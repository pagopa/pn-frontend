import { ReactNode, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  header?: ReactNode;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
};

const DigitalContactsCard: React.FC<Props> = ({ header, title, subtitle, children }) => {
  const isMobile = useIsMobile();
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Card sx={{ p: 3 }}>
      {header && (
        <CardHeader data-testid="DigitalContactsCardHeader" sx={{ p: 0 }} title={header} />
      )}
      <CardContent data-testid="DigitalContactsCardBody" sx={{ p: 0 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            color="text.primary"
            fontWeight={700}
            fontSize={18}
            variant="body1"
            mb={2}
            data-testid="DigitalContactsCardTitle"
          >
            {title}
          </Typography>
          {isMobile && !showDescription && (
            <KeyboardArrowDownOutlinedIcon
              color="primary"
              onClick={() => setShowDescription(true)}
            />
          )}
          {isMobile && showDescription && (
            <KeyboardArrowUpOutlinedIcon
              color="primary"
              onClick={() => setShowDescription(false)}
            />
          )}
        </Stack>
        {(!isMobile || (isMobile && showDescription)) && (
          <Typography
            color="text.secondary"
            fontWeight={400}
            variant="body1"
            mb={2}
            data-testid="DigitalContactsCardDescription"
          >
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
};
export default DigitalContactsCard;
