import { isMobileDevice } from '@pagopa-pn/pn-commons';

export const openAppIoDownloadPage = (params: { appIoSite?: string; appIoDownload?: string }) => {
  const { appIoSite, appIoDownload } = params;

  if (isMobileDevice() && appIoDownload) {
    window.location.assign(appIoDownload);
  } else if (appIoSite) {
    window.location.assign(appIoSite);
  }
};
