import { ReactNode } from 'react';

import { Grid, GridProps, GridSize, SxProps, Theme, Typography } from '@mui/material';
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
  /** style for title Grid item */
  propsTitle?: GridProps;
  mtGrid?: number;
  /** Gridsize for subtitle on mobile devices */
  mbSubTitle?: number;
  /** Typography variant for title */
  variantTitle?: Variant;
  /** Typography variant for subtitle */
  variantSubTitle?: Variant;
  /** style to apply */
  sx?: SxProps<Theme>;
  /** paragraph component */
  children?: React.ReactNode;
};

/**
 * TitleBox element. It renders a Title (default variant is h1) and a subtitle (default variant is h5)
 */
const TitleBox: React.FC<Props> = ({
  title,
  titleButton,
  subTitle,
  mbTitle = 2,
  propsTitle,
  mtGrid,
  mbSubTitle,
  variantTitle = 'h1',
  variantSubTitle = 'h5',
  sx,
  children,
}) => (
  <Grid id="page-header-container" aria-orientation="horizontal" container mt={mtGrid} sx={sx}>
    {title && (
      <Grid id="item" item xs={12} mb={mbTitle} {...propsTitle}>
        <Typography
          id={`${title}-page`}
          data-testid="titleBox"
          role="heading"
          variant={variantTitle}
          display="inline-block"
          sx={{ verticalAlign: 'middle', overflowWrap: 'anywhere' }}
        >
          {title}
        </Typography>
        {titleButton}
      </Grid>
    )}
    {subTitle && (
      <Grid aria-orientation="horizontal" item xs={12} mb={mbSubTitle}>
        <Typography
          id="subtitle-page"
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

export default TitleBox;
