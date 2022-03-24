import { GridSize, Typography, Grid } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ReactFragment } from 'react';

type Props = {
  /** Title of the page to render */
  title: string;
  /** Subtitle (optional) of the page to render */
  subTitle?: string;
  /** Gridsize for title on mobile devices */
  mbTitle?: GridSize;
  mtGrid?: number;
  /** Gridsize for subtitle on mobile devices */
  mbSubTitle?: number;
  /** Typography variant for title */
  variantTitle?: Variant;
  /** Typography variant for subtitle */
  variantSubTitle?: Variant;
  /** Children */
  children?: ReactFragment;
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
  children,
}: Props) {
  return (
    <Grid container mt={mtGrid}>
      <Grid item xs={12} mb={mbTitle}>
        <Typography variant={variantTitle}>{title}</Typography>
      </Grid>
      <Grid item xs={12} mb={mbSubTitle}>
        <Typography variant={variantSubTitle} sx={{ fontSize: '18px' }}>
          {subTitle}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: '18px' }}>{children}</Typography>
      </Grid>
    </Grid>
  );
}
