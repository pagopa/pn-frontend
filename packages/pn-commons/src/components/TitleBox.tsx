import { GridSize, Typography, Grid, SxProps, Theme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ReactFragment, ReactNode } from 'react';

type Props = {
  /** Title of the page to render */
  title: ReactNode;
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
  /** Children */
  children?: ReactFragment;
  /** a11y for component */
  ariaLabel?: string;
};

/**
 * TitleBox element. It renders a Title (default variant is h1) and a subtitle (default variant is h5)
 */
export default function TitleBox({
  title,
  subTitle,
  mbTitle = 2,
  mtGrid,
  mbSubTitle,
  variantTitle = 'h1',
  variantSubTitle = 'h5',
  sx,
  ariaLabel,
  children,
}: Props) {
  return (
    <Grid
      id="page-header-container"
      aria-orientation="horizontal"
      tabIndex={0}
      container
      mt={mtGrid}
      sx={sx}
    >
      {title && (
        <Grid id="item" item xs={12} mb={mbTitle}>
          <Typography
            id="title-of-page"
            role="heading"
            aria-label={ariaLabel}
            aria-selected="true"
            variant={variantTitle}
          >
            {title}
          </Typography>
        </Grid>
      )}
      {subTitle && (
        <Grid aria-orientation="horizontal" item xs={12} mb={mbSubTitle}>
          <Typography
            variant={variantSubTitle}
            sx={{ fontSize: '18px' }}
            component={typeof subTitle !== 'string' ? 'div' : 'p'}
          >
            {subTitle}
          </Typography>
        </Grid>
      )}
      <Grid aria-orientation="vertical" item xs={12}>
        <Typography sx={{ fontSize: '18px' }}>{children}</Typography>
      </Grid>
    </Grid>
  );
}
