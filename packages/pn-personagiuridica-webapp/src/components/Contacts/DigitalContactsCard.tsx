import { ReactNode, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  header?: ReactNode;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
};

const DigitalContactsCardTitle: React.FC<Pick<Props, 'title'>> = ({ title }) => (
  <>
    {typeof title === 'string' && (
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
    )}
    {typeof title !== 'string' && title}
  </>
);

const DigitalContactsCardContent: React.FC<
  Pick<Props, 'title' | 'subtitle' | 'children'> & { sx?: SxProps }
> = ({ title, subtitle, sx, children }) => {
  const isMobile = useIsMobile();
  const [showDescription, setShowDescription] = useState(false);
  return (
    <Box sx={sx}>
      {isMobile && (
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <DigitalContactsCardTitle title={title} />
          {!showDescription && (
            <KeyboardArrowDownOutlinedIcon
              color="primary"
              onClick={() => setShowDescription(true)}
              sx={{ mb: 2 }}
            />
          )}
          {showDescription && (
            <KeyboardArrowUpOutlinedIcon
              color="primary"
              onClick={() => setShowDescription(false)}
              sx={{ mb: 2 }}
            />
          )}
        </Stack>
      )}
      {!isMobile && <DigitalContactsCardTitle title={title} />}
      {(!isMobile || (isMobile && showDescription)) && (
        <Typography
          color="text.secondary"
          fontWeight={400}
          variant="body1"
          mb={3}
          data-testid="DigitalContactsCardDescription"
        >
          {subtitle}
        </Typography>
      )}
      {isMobile && <Divider sx={{ mb: 2 }} />}
      {children}
    </Box>
  );
};

const DigitalContactsCard: React.FC<Props> = ({ header, title, subtitle, children }) => (
  <Card sx={{ p: 3 }}>
    {header && <CardHeader data-testid="DigitalContactsCardHeader" sx={{ p: 0 }} title={header} />}
    <CardContent data-testid="DigitalContactsCardBody" sx={{ p: 0, paddingBottom: '0 !important' }}>
      <DigitalContactsCardContent title={title} subtitle={subtitle}>
        {children}
      </DigitalContactsCardContent>
    </CardContent>
  </Card>
);
export default DigitalContactsCard;
