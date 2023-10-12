import { LoadingOverlay, LoadingPage, appStateSelectors } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';

type Props = {
  isInitialized?: boolean;
  children?: React.ReactNode;
};

const LoadingPageWrapper: React.FC<Props> = ({ isInitialized = false, children }) => {
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
