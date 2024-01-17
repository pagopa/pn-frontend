import { ReactNode } from 'react';
import { GridSize, SxProps, Theme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
type Props = {
    /** Title of the page to render */
    title: ReactNode;
    /** Button near the title */
    titleButton?: ReactNode;
    /** Subtitle (optional) of the page to render */
    subTitle?: string | JSX.Element;
    /** Gridsize for title on mobile devices */
    mbTitle?: GridSize;
    mtGrid?: number;
    /** Gridsize for subtitle on mobile devices */
    mbSubTitle?: number;
    /** Typography variant for title */
    variantTitle?: Variant;
    /** Typography variant for subtitle */
    variantSubTitle?: Variant;
    /** style to apply */
    sx?: SxProps<Theme>;
    /** a11y for component */
    ariaLabel?: string;
};
/**
 * TitleBox element. It renders a Title (default variant is h1) and a subtitle (default variant is h5)
 */
declare const TitleBox: React.FC<Props>;
export default TitleBox;
