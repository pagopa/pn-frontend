import { Box, Typography } from "@mui/material";

const HeadingTitle = ({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string | JSX.Element;
}) => (
  <Box sx={{ textAlign: "center", px: 2 }}>
    <Typography variant="h4" sx={{ mb: 3 }}>
      {title}
    </Typography>
    <Typography sx={{ mb: 4 }} variant="body2">
      {subtitle}
    </Typography>
  </Box>
);

export default HeadingTitle;
