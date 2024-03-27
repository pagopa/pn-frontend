import { appStateSelectors, LoadingOverlay, LoadingPage } from '@pagopa-pn/pn-commons';
import { useAppSelector } from '../../redux/hooks';

const LoadingPageWrapper: React.FC<{ isInitialized?: boolean }> = ({
  isInitialized = false,
  children,
}) => {
  const loading = useAppSelector(appStateSelectors.selectLoading);

  return (
    <>
      {!isInitialized && (
        <LoadingPage
          sx={{ position: 'absolute', width: '100%', zIndex: 3, backgroundColor: 'white' }}
        />
      )}
      {isInitialized && loading && <LoadingOverlay />}
      {children}
    </>
  );
};

export default LoadingPageWrapper;
