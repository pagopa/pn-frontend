import { jsx as _jsx } from "react/jsx-runtime";
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    root: {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginTop: 0,
    },
}));
/**
 * Renders a section heading with the style of an H6 element using an H3 element.
 * This solves some a11y issues in manual send sections
 */
const SectionHeading = ({ children }) => {
    const classes = useStyles();
    return (_jsx(Typography, { id: "title-heading-section", component: "h3", variant: "h6", className: classes.root, children: children }));
};
export default SectionHeading;
