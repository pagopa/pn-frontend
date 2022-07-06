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
import MobileNotificationsSort from './components/Notifications/MobileNotificationsSort';
import ItemsTable from './components/Data/ItemsTable';
import EmptyState from './components/EmptyState';
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
import CustomDatePicker from './components/CustomDatePicker';
import PnBreadcrumb from './components/PnBreadcrumb';
import FileUpload from './components/FileUpload';
import Prompt from './components/Prompt';
import CopyToClipboard from './components/CopyToClipboard';

export { LoadingOverlay };
export { Header };
export { Layout };
export { Footer };
export { CustomPagination };
export { CustomTooltip };
export { AppMessage };
export { SideMenu };
export { ItemsTable };
export { EmptyState };
export { StatusTooltip };
export { MobileNotificationsSort };
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
export { CustomDatePicker };
export { PnBreadcrumb };
export { FileUpload };
export { Prompt };
export { CopyToClipboard };

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
  PaymentInfo,
  NotificationStatusHistory,
  TimelineCategory,
  DigitalDomicileType,
  RecipientType,
  AddressSource,
  LegalFactType,
  LegalFactId,
  PhysicalCommunicationType,
  PaymentInfoDetail,
  PaymentStatus,
  PaymentAttachmentSName,
  PaymentAttachmentNameType
} from './types/NotificationDetail';
import { CardElement, CardSort, CardAction } from './types/ItemsCard';
import { MessageType } from './types/MessageType';
import { DatePickerTypes } from './components/CustomDatePicker';

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
  AddressSource,
  PhysicalCommunicationType,
  PaymentInfoDetail,
  PaymentAttachmentSName,
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
  PaymentInfo,
  LegalFactId,
  PaymentAttachmentNameType
};
export type { CardElement, CardSort, CardAction };
export type { NotificationDetailTableRow };
export { MessageType, PaymentStatus };
export type {DatePickerTypes};

// functions
import { createAppError } from './services/message.service';
import { formatDate } from './services/date.service';
import { calculatePages } from './utils/pagination.utility';
import {
  getNotificationStatusInfos,
  NotificationAllowedStatus,
  parseNotificationDetail,
  filtersApplied
} from './utils/notification.utility';
import { getMonthString, getDay, getTime, today, tenYearsAgo, DATE_FORMAT, getNextDay, formatToTimezoneString } from './utils/date.utility';
import { formatFiscalCode, fiscalCodeRegex } from './utils/fiscal_code.utility';
import { IUN_regex, formatIun } from './utils/iun.utility';
import { formatCurrency, formatEurocentToCurrency } from './utils/currency.utility';
import { storageOpsBuilder } from './utils/storage.utility';
import { compileRoute } from './utils/routes.utility';
import { useUnload } from './utils/useUnload.utlity';

export { NotificationAllowedStatus };
export { getNotificationStatusInfos };
export { parseNotificationDetail };
export { filtersApplied };
export { createAppError };
export { formatDate };
export { calculatePages };
export { getMonthString, getDay, getTime, getNextDay, formatToTimezoneString };
export { formatFiscalCode };
export { fiscalCodeRegex };
export { IUN_regex, formatIun };
export { formatCurrency, formatEurocentToCurrency };
export { storageOpsBuilder };
export { compileRoute };
export { useUnload };

// consts
export { today, tenYearsAgo, DATE_FORMAT };

// hooks
import { useIsMobile } from './hooks/IsMobile';

export { useIsMobile };

// reducers
import { appStateReducer } from './redux/slices/appStateSlice';

export { appStateReducer };

// actions
import { appStateActions } from './redux/slices/appStateSlice';

export { appStateActions };
