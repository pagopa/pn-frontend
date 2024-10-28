import { Typography } from '@mui/material';

type Props = {
  text: string;
};

export const FormBoxSubtitle = ({ text }: Props) => (
  <Typography variant="body2" fontSize={'14px'} marginTop={0.5}>
    {text}
  </Typography>
);
