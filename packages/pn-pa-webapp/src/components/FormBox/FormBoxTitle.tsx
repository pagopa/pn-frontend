import { Typography } from '@mui/material';

type Props = {
  text: string;
};

export const FormBoxTitle = ({ text }: Props) => (
  <Typography variant="sidenav" fontWeight={600} fontSize={16}>
    {text}
  </Typography>
);
