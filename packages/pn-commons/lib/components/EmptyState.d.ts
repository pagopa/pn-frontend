/// <reference types="react" />
import { SvgIconComponent } from '@mui/icons-material';
import { KnownSentiment } from '../models/EmptyState';
type Props = {
    sentimentIcon?: KnownSentiment | SvgIconComponent;
};
declare const EmptyState: React.FC<Props>;
export default EmptyState;
