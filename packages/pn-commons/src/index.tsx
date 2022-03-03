// components
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import CustomPagination from './components/Pagination/CustomPagination';
import CustomTooltip from './components/CustomTooltip';
import AppMessage from './components/AppMessage';

export { LoadingOverlay };
export { Header };
export { Layout };
export { Footer };
export { CustomPagination };
export { CustomTooltip };
export { AppMessage };

// pages
import NotFound from './navigation/NotFound';
import AccessDenied from './navigation/AccessDenied';

export { NotFound };
export { AccessDenied };

// types
import { AppError } from './types/AppError';
import { PaginationData } from './components/Pagination/types';
import { NotificationStatus } from './types/NotificationStatus';
export type { AppError };
export type { PaginationData };
export { NotificationStatus };

// functions
import { createAppError } from './services/error.service';
import { formatDate } from './services/date.service';
import { calcPages } from './utils/pagination.utility';
import {
  getNotificationStatusLabelAndColor,
  NotificationAllowedStatus,
} from './utils/status.utility';

export { NotificationAllowedStatus };
export { getNotificationStatusLabelAndColor };
export { createAppError };
export { formatDate };
export { calcPages };
