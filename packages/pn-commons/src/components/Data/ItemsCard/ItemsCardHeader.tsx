import { CardHeader } from '@mui/material';

import { IItemsCardHeaderTitleProps } from './ItemsCardHeaderTitle';

export interface IItemsCardHeaderProps {
  testId?: string;
  className?: string;
  children?: React.ReactElement<IItemsCardHeaderTitleProps>;
}
const ItemsCardHeader: React.FC<IItemsCardHeaderProps> = ({
  testId,
  className = 'card-header',
  children,
}) => <CardHeader data-testid={testId} className={className} title={children} />;

export default ItemsCardHeader;
