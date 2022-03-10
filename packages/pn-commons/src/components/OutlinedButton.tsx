import { Button, styled } from '@mui/material';

const ThemedButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  padding: '8px 16px',

  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const OutlinedButton = ({ children }: any) => (
  <ThemedButton variant={'outlined'}>{children}</ThemedButton>
);

export default OutlinedButton;
