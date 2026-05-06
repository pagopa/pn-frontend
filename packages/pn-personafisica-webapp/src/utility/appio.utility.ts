export const openAppIoDownloadPage = (params: {
  appIoSite?: string;
  appIoAndroid?: string;
  appIoIos?: string;
}) => {
  const { appIoSite, appIoAndroid, appIoIos } = params;

  const androidPhone = /Android/i.test(navigator.userAgent);
  const iosPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (androidPhone && appIoAndroid) {
    window.location.assign(appIoAndroid);
  } else if (iosPhone && appIoIos) {
    window.location.assign(appIoIos);
  } else if (appIoSite) {
    window.location.assign(appIoSite);
  }
};
