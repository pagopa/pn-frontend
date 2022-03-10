import { Box, Typography } from '@mui/material';

const TitleAndDescription: React.FC<{ title: string; children: any }> = ({ title, children }) => (
  <Box>
    <Typography my={2} variant="h4">
      {title}
    </Typography>
    <Typography marginRight={2}>{children}</Typography>
  </Box>
);

export default TitleAndDescription;
