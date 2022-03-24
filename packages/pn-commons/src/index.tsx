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
import NotificationsCard from './components/Notifications/NotificationsCard';
import OutlinedButton from './components/OutlinedButton';
import TitleAndDescription from './components/TitleAndDescription';
import CustomMobileDialog from './components/CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogToggle from './components/CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogContent from './components/CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogAction from './components/CustomMobileDialog/CustomMobileDialogAction';
import TitleBox from './components/TitleBox';
import NotificationDetailTable from './components/NotificationDetail/NotificationDetailTable';
import NotificationDetailDocuments from './components/NotificationDetail/NotificationDetailDocuments';
import NotificationDetailTimeline from './components/NotificationDetail/NotificationDetailTimeline';

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
export { NotificationsCard };
export { OutlinedButton };
export { TitleAndDescription };
export { CustomMobileDialog };
export { CustomMobileDialogToggle };
export { CustomMobileDialogContent };
export { CustomMobileDialogAction };
export { TitleBox };
export { NotificationDetailTable };
export { NotificationDetailDocuments };
export { NotificationDetailTimeline };

// pages
import NotFound from './navigation/NotFound';
import AccessDenied from './navigation/AccessDenied';
import CourtesyPage from './components/CourtesyPage';

export { NotFound };
export { AccessDenied };
export { CourtesyPage };

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
  INotificationDetailTimeline,
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
import { CardElem, CardSort, CardAction } from './types/NotificationsCard';
import { DetailTableRow } from './types/NotificationDetailTable';

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
  INotificationDetailTimeline,
  NotificationDetailRecipient,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationStatusHistory,
  LegalFactId,
};
export type { CardElem, CardSort, CardAction };
export type { DetailTableRow };

// functions
import { createAppError } from './services/error.service';
import { formatDate } from './services/date.service';
import { calcPages } from './utils/pagination.utility';
import {
  getNotificationStatusLabelAndColor,
  NotificationAllowedStatus,
} from './utils/status.utility';
import { getMonthString, getDay, getTime, today, tenYearsAgo } from './utils/date.utility';
import { formatFiscalCode, fiscalCodeRegex } from './utils/fiscal_code.utility';

export { NotificationAllowedStatus };
export { getNotificationStatusLabelAndColor };
export { createAppError };
export { formatDate };
export { calcPages };
export { getMonthString, getDay, getTime };
export { formatFiscalCode };
export { fiscalCodeRegex };

// consts
export { today, tenYearsAgo };

// hooks
import { useIsMobile } from './hooks/IsMobile.hook';

export { useIsMobile };

// reducers
import { appStateReducer } from './redux/slices/appStateSlice';

export { appStateReducer };
