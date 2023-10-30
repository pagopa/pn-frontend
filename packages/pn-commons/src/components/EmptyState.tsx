import { SvgIconComponent } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { KnownSentiment, iconForKnownSentiment } from '../models/EmptyState';

export type Props = {
  sentimentIcon?: KnownSentiment | SvgIconComponent;
};

const EmptyState: React.FC<Props> = ({ sentimentIcon = KnownSentiment.DISSATISFIED, children }) => {
  const FinalIcon =
    typeof sentimentIcon === 'string' ? iconForKnownSentiment(sentimentIcon) : sentimentIcon;
  const linksSxProps = {
    cursor: 'pointer',
    display: 'inline',
    verticalAlign: 'unset',
    fontWeight: 'bold',
    fontSize: 'inherit',
  };
  return (
    <Box
      component="div"
      data-testid="emptyState"
      display="block"
      sx={{
        textAlign: 'center',
        margin: '16px 0',
        padding: '16px',
        backgroundColor: 'background.paper',
        borderRadius: '4px',
      }}
    >
      {FinalIcon && (
        <FinalIcon
          sx={{
            verticalAlign: 'middle',
            display: 'inline',
            mr: '20px',
            mb: '2px',
            fontSize: '1.25rem',
            color: 'action.active',
          }}
        />
      )}
      <Typography variant="body2" sx={{ display: 'inline', '& button': linksSxProps }}>
        {children}
      </Typography>
    </Box>
  );
};

export default EmptyState;
