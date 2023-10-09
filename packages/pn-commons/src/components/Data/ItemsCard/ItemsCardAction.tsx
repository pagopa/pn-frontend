import { Box } from '@mui/material';

type Props = {
  testId?: string;
  handleOnClick?: () => void;
};

const ItemsCardAction: React.FC<Props> = ({ testId, children, handleOnClick }) => (
  <Box onClick={() => handleOnClick && handleOnClick()} data-testid={testId} sx={{ ml: 'auto' }}>
    {children}
  </Box>
);
export default ItemsCardAction;
