import { Box, Grid, GridSize, Skeleton, Stack, SxProps } from '@mui/material';

type Props = {
  renderType?: 'whole' | 'part';
  layout?: Array<{
    id: string;
    lg?: boolean | GridSize;
    md?: boolean | GridSize;
    sm?: boolean | GridSize;
    xl?: boolean | GridSize;
    xs?: boolean | GridSize;
  }>;
  sx?: SxProps;
  loadingFinished?: boolean;
};

const headerHeight = '128px';
const footerHeight = '139px';
const titleHeight = '36px';

const LoadingPage = ({ renderType = 'part', layout, sx, loadingFinished }: Props) => {
  if (renderType === 'whole') {
    return (
      <Box p={1} height="100vh" sx={sx} data-testid="loading-skeleton" aria-live='polite' aria-busy={loadingFinished}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={headerHeight}
          sx={{ marginBottom: 1 }}
          data-testid="header"
        />
        <Stack
          height={`calc(100% - ${headerHeight} - ${footerHeight} - 16px)`}
          direction={{ xs: 'column', lg: 'row' }}
          sx={{ flexGrow: 1 }}
        >
          <Box sx={{ width: { lg: 300 }, flexShrink: '0', marginRight: { lg: 1 } }} component="nav">
            <Skeleton variant="rectangular" width="100%" height="100%" data-testid="menu" />
          </Box>
          <Box sx={{ flexGrow: 1 }} component="main">
            <Skeleton variant="rectangular" width="100%" height="100%" data-testid="body" />
          </Box>
        </Stack>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={footerHeight}
          sx={{ marginTop: 1 }}
          data-testid="footer"
        />
      </Box>
    );
  }

  const pageLayout = layout ? (
    <Box height={`calc(100% - ${titleHeight} - 80px)`} data-testid="customContent" >
      <Grid container spacing={2}>
        {layout.map((l) => (
          <Grid item key={l.id} xs={l.xs} xl={l.xl} sm={l.sm} md={l.md} lg={l.lg}>
            <Skeleton variant="rectangular" width="100%" height="300px" />
          </Grid>
        ))}
      </Grid>
    </Box>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={`calc(100% - ${titleHeight} - 80px)`}
      data-testid="content"
    />
  );

  return (
    <Box p={2} height="100%" sx={sx} data-testid="loading-skeleton" aria-live='polite' aria-busy={loadingFinished}>
      <Skeleton
        variant="rectangular"
        height={titleHeight}
        sx={{ marginBottom: 2 }}
        data-testid="title"
      />
      <Skeleton sx={{ marginBottom: 4 }} data-testid="subTitle" />
      {pageLayout}
    </Box>
  );
};

export default LoadingPage;

// old layout
/*
  <Box display="flex" height="100%" sx={sx}>
    <Box m="auto" width="100%" textAlign="center">
      <HourglassBottomIcon htmlColor="#00C5CA" sx={{width: '80px', height:'80px'}}/>
      <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
        Loading...
      </Typography>
      <Typography variant="body1" color="text.primary">
        {getLocalizedOrDefaultLabel(
          'common',
          'loading-page',
          'Stiamo caricarando la pagina. Sarà presto disponibile'
        )}
      </Typography>
    </Box>
  </Box>
*/
