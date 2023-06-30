import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
}

const useStyles = makeStyles(() => ({
  root: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: 0
  },
}));

/**
 * Renders a section heading with the style of an H6 element using an H3 element.
 * This solves some a11y issues in manual send sections
 *
 * @param {SectionHeadingProps} props - The props object.
 * @returns {JSX.Element} The rendered section heading.
 */
function SectionHeading(props: SectionHeadingProps): JSX.Element {
  const classes = useStyles();
  return (
    <Typography component="h3" variant="h6" className={classes.root}>
      {props.children}
    </Typography>
  );
}

export default SectionHeading;
