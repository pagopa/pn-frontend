import { ReactNode } from 'react';
import { appStateSelectors, LoadingOverlay, LoadingPage } from '@pagopa-pn/pn-commons';
import { useAppSelector } from '../../redux/hooks';

const LoadingPageWrapper = ({
  children,
  isInitialized = false,
}: {
  children: ReactNode;
  isInitialized?: boolean;
}) => {
  const loading = useAppSelector(appStateSelectors.selectLoading);
  
  return (
    <>
      {!isInitialized && (
        <LoadingPage
          sx={{ position: 'absolute', width: '100%', zIndex: 3, backgroundColor: 'white' }}
          loadingFinished={loading}
        />
      )}
      {isInitialized && loading && <LoadingOverlay />}
      {children}
    </>
  );
};

export default LoadingPageWrapper;
