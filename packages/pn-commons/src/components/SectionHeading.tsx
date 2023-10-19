import { ReactNode } from 'react';

import Typography from '@mui/material/Typography';

interface SectionHeadingProps {
  children: ReactNode;
}

const style = {
  root: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: 0,
  },
};

/**
 * Renders a section heading with the style of an H6 element using an H3 element.
 * This solves some a11y issues in manual send sections
 *
 * @param {SectionHeadingProps} props - The props object.
 * @returns {JSX.Element} The rendered section heading.
 */
function SectionHeading(props: SectionHeadingProps): JSX.Element {
  return (
    <Typography id="title-heading-section" component="h3" variant="h6" sx={style.root}>
      {props.children}
    </Typography>
  );
}

export default SectionHeading;
