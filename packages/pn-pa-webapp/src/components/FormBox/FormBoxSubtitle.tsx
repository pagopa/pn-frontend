import { Typography } from '@mui/material';

type Props = {
  text: string;
};

export const FormBoxSubtitle = ({ text }: Props) => (
  <Typography variant="body2" fontSize={14} marginTop={'4px'}>
    {text}
  </Typography>
);
