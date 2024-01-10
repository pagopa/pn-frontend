import React from 'react';

import Typography from '@mui/material/Typography';

type Props = {
  children?: React.ReactNode;
};

/**
 * Renders a section heading with the style of an H6 element using an H3 element.
 * This solves some a11y issues in manual send sections
 */
const SectionHeading: React.FC<Props> = ({ children }) => (
  <Typography
    id="title-heading-section"
    component="h3"
    variant="h6"
    sx={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 0 }}
  >
    {children}
  </Typography>
);

export default SectionHeading;
