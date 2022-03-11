// components
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import CustomPagination from './components/Pagination/CustomPagination';
import CustomTooltip from './components/CustomTooltip';
import AppMessage from './components/AppMessage';
import SideMenu from './components/SideMenu/SideMenu';
import NotificationsTable from './components/Notifications/NotificationsTable';
import StatusTooltip from './components/Notifications/StatusTooltip';

export { LoadingOverlay };
export { Header };
export { Layout };
export { Footer };
export { CustomPagination };
export { CustomTooltip };
export { AppMessage };
export { SideMenu };
export { NotificationsTable };
export { StatusTooltip };

// pages
import NotFound from './navigation/NotFound';
import AccessDenied from './navigation/AccessDenied';

export { NotFound };
export { AccessDenied };

// types
import { AppError } from './types/AppError';
import { PaginationData } from './components/Pagination/types';
import { NotificationStatus } from './types/NotificationStatus';
import { SideMenuItem } from './types/SideMenuItem';
import { Column, Row, Sort } from './types/NotificationsTable';
import {
  Notification,
  GetNotificationsResponse,
  GetNotificationsParams,
  NotificationDetail,
  NotificationDetailTimeline,
  NotificationDetailRecipient,
  NotificationDetailDocument,
  NotificationFeePolicy,
  NotificationDetailPayment,
  NotificationStatusHistory,
  TimelineCategory,
  DigitalDomicileType,
  RecipientType,
  DeliveryMode,
  AddressSource,
  LegalFactType,
  LegalFactId,
  PhysicalCommunicationType,
} from './types/Notifications';

export type { AppError };
export type { PaginationData };
export type { SideMenuItem };
export {
  NotificationStatus,
  RecipientType,
  DigitalDomicileType,
  NotificationFeePolicy,
  TimelineCategory,
  LegalFactType,
  DeliveryMode,
  AddressSource,
  PhysicalCommunicationType,
};
export type { Column, Row, Sort };
export type {
  Notification,
  GetNotificationsResponse,
  GetNotificationsParams,
  NotificationDetail,
  NotificationDetailTimeline,
  NotificationDetailRecipient,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationStatusHistory,
  LegalFactId,
};

// functions
import { createAppError } from './services/error.service';
import { formatDate } from './services/date.service';
import { calcPages } from './utils/pagination.utility';
import {
  getNotificationStatusLabelAndColor,
  NotificationAllowedStatus,
} from './utils/status.utility';
import { getMonthString, getDay, getTime } from './utils/date.utility';

export { NotificationAllowedStatus };
export { getNotificationStatusLabelAndColor };
export { createAppError };
export { formatDate };
export { calcPages };
export { getMonthString, getDay, getTime };

// consts
import { today, tenYearsAgo } from './utils/date.utility';

export { today, tenYearsAgo };

// hooks
import { useIsMobile } from './hooks/IsMobile.hook';

export { useIsMobile };
