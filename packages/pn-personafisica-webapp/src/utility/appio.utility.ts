export const openAppIoDownloadPage = (params: { appIoSite?: string; appIoDownload?: string }) => {
  const { appIoSite, appIoDownload } = params;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile && appIoDownload) {
    window.location.assign(appIoDownload);
  } else if (appIoSite) {
    window.location.assign(appIoSite);
  }
};
