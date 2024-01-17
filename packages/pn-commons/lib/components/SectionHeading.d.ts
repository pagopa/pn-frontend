/// <reference types="react" />
type Props = {
    children?: React.ReactNode;
};
/**
 * Renders a section heading with the style of an H6 element using an H3 element.
 * This solves some a11y issues in manual send sections
 */
declare const SectionHeading: React.FC<Props>;
export default SectionHeading;
