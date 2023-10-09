import { CardHeader } from '@mui/material';

type Props = {
  testId?: string;
  className?: string;
};
const ItemsCardHeader: React.FC<Props> = ({ testId, className = 'card-header', children }) => (
  <CardHeader data-testid={testId} className={className} title={children} />
);

export default ItemsCardHeader;
