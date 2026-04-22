import { Box, SxProps, Theme } from '@mui/material';

type Props = {
  src: string;
  alt?: string;
  decorative?: boolean;
  width?: number | string;
  height?: number | string;
  sx?: SxProps<Theme>;
};

const OnboardingImage: React.FC<Props> = ({
  src,
  alt = '',
  decorative = true,
  width,
  height,
  sx,
}) => (
  <Box
    component="img"
    src={src}
    alt={decorative ? '' : alt}
    aria-hidden={decorative ? 'true' : undefined}
    sx={{
      display: 'block',
      width: width || '100%',
      height: height || 'auto',
      objectFit: 'cover',
      ...sx,
    }}
  />
);

export default OnboardingImage;
