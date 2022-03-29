// components
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import CustomPagination from './components/Pagination/CustomPagination';
import CustomTooltip from './components/CustomTooltip';
import AppMessage from './components/AppMessage';
import SideMenu from './components/SideMenu/SideMenu';
import StatusTooltip from './components/Notifications/StatusTooltip';
import ItemsTable from './components/Data/ItemsTable';
import ItemCard from './components/Data/ItemCard';
import TitleAndDescription from './components/TitleAndDescription';
import CustomMobileDialog from './components/CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogToggle from './components/CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogContent from './components/CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogAction from './components/CustomMobileDialog/CustomMobileDialogAction';
import TitleBox from './components/TitleBox';
import NotificationDetailTable from './components/NotificationDetail/NotificationDetailTable';
import NotificationDetailDocuments from './components/NotificationDetail/NotificationDetailDocuments';
import NotificationDetailTimeline from './components/NotificationDetail/NotificationDetailTimeline';
import Toast from './components/Toast/Toast';

export { LoadingOverlay };
export { Header };
export { Layout };
export { Footer };
export { CustomPagination };
export { CustomTooltip };
export { AppMessage };
export { SideMenu };
export { ItemsTable };
export { StatusTooltip };
export { ItemCard };
export { TitleAndDescription };
export { CustomMobileDialog };
export { CustomMobileDialogToggle };
export { CustomMobileDialogContent };
export { CustomMobileDialogAction };
export { TitleBox };
export { NotificationDetailTable };
export { NotificationDetailDocuments };
export { NotificationDetailTimeline };
export { Toast };

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
import { Column, Item, Sort } from './types/ItemsTable';
import {
  Notification,
  GetNotificationsResponse,
  GetNotificationsParams,
} from './types/Notifications';
import {
  NotificationDetailTableRow,
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
} from './types/NotificationDetail';

import { CardElement, CardSort, CardAction } from './types/ItemCard';
import { MessageType } from './types/MessageType';

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
export type { Column, Item, Sort };
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
export type { CardElement, CardSort, CardAction };
export type { NotificationDetailTableRow };
export { MessageType };

// functions
import { createAppError } from './services/error.service';
import { formatDate } from './services/date.service';
import { calculatePages } from './utils/pagination.utility';
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
export { calculatePages };
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
