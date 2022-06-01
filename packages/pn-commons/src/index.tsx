// components
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import CustomPagination from './components/Pagination/CustomPagination';
import CustomTooltip from './components/CustomTooltip';
import AppMessage from './components/AppMessage';
import SessionModal from './components/SessionModal';
import SideMenu from './components/SideMenu/SideMenu';
import StatusTooltip from './components/Notifications/StatusTooltip';
import ItemsTable from './components/Data/ItemsTable';
import ItemsCard from './components/Data/ItemsCard';
import TitleAndDescription from './components/TitleAndDescription';
import CustomMobileDialog from './components/CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogToggle from './components/CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogContent from './components/CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogAction from './components/CustomMobileDialog/CustomMobileDialogAction';
import TitleBox from './components/TitleBox';
import NotificationDetailTable from './components/NotificationDetail/NotificationDetailTable';
import NotificationDetailDocuments from './components/NotificationDetail/NotificationDetailDocuments';
import HelpNotificationDetails from './components/NotificationDetail/HelpNotificationDetails';
import NotificationDetailTimeline from './components/NotificationDetail/NotificationDetailTimeline';
import Toast from './components/Toast/Toast';
import CodeModal from './components/CodeModal/CodeModal';
import InactivityHandler from './components/InactivityHandler';
import BreadcrumbLink from './components/BreadcrumbLink';
import FileUpload from './components/FileUpload';
import Prompt from './components/Prompt';

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
export { SessionModal };
export { ItemsCard };
export { TitleAndDescription };
export { CustomMobileDialog };
export { CustomMobileDialogToggle };
export { CustomMobileDialogContent };
export { CustomMobileDialogAction };
export { TitleBox };
export { NotificationDetailTable };
export { NotificationDetailDocuments };
export { HelpNotificationDetails };
export { NotificationDetailTimeline };
export { Toast };
export { CodeModal };
export { InactivityHandler };
export { BreadcrumbLink };
export { FileUpload };
export { Prompt };

// pages
import NotFound from './navigation/NotFound';
import AccessDenied from './navigation/AccessDenied';
import CourtesyPage from './components/CourtesyPage';

export { NotFound };
export { AccessDenied };
export { CourtesyPage };

// types
import { IAppMessage } from './types/AppMessage';
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
  PaymentDetail,
  NotificationStatusHistory,
  TimelineCategory,
  DigitalDomicileType,
  RecipientType,
  DeliveryMode,
  AddressSource,
  LegalFactType,
  LegalFactId,
  PhysicalCommunicationType,
  PaymentStatus,
} from './types/NotificationDetail';

import { CardElement, CardSort, CardAction } from './types/ItemsCard';
import { MessageType } from './types/MessageType';

export type { IAppMessage };
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
  PaymentDetail,
  LegalFactId,
};
export type { CardElement, CardSort, CardAction };
export type { NotificationDetailTableRow };
export { MessageType, PaymentStatus };

// functions
import { createAppError } from './services/message.service';
import { formatDate } from './services/date.service';
import { calculatePages } from './utils/pagination.utility';
import {
  getNotificationStatusInfos,
  NotificationAllowedStatus,
  parseNotificationDetail,
} from './utils/notification.utility';
import { getMonthString, getDay, getTime, today, tenYearsAgo } from './utils/date.utility';
import { formatFiscalCode, fiscalCodeRegex } from './utils/fiscal_code.utility';
import { formatCurrency, formatEurocentToCurrency } from './utils/currency.utility';
import { storageOpsBuilder } from './utils/storage.utility';

export { NotificationAllowedStatus };
export { getNotificationStatusInfos };
export { parseNotificationDetail };
export { createAppError };
export { formatDate };
export { calculatePages };
export { getMonthString, getDay, getTime };
export { formatFiscalCode };
export { fiscalCodeRegex };
export { formatCurrency, formatEurocentToCurrency };
export { storageOpsBuilder };

// consts
export { today, tenYearsAgo };

// hooks
import { useIsMobile } from './hooks/IsMobile';

export { useIsMobile };

// reducers
import { appStateReducer } from './redux/slices/appStateSlice';

export { appStateReducer };

// actions
import { appStateActions } from './redux/slices/appStateSlice';

export { appStateActions };
