import { Box, SxProps, Theme } from '@mui/material';

type Props = {
  src: string;
  alt?: string;
  decorative?: boolean;
  sx?: SxProps<Theme>;
};

const OnboardingImage: React.FC<Props> = ({ src, alt = '', decorative = true, sx }) => (
  <Box
    component="img"
    src={src}
    alt={decorative ? '' : alt}
    aria-hidden={decorative ? 'true' : undefined}
    sx={{
      display: 'block',
      width: '100%',
      height: 'auto',
      ...sx,
    }}
  />
);

export default OnboardingImage;
