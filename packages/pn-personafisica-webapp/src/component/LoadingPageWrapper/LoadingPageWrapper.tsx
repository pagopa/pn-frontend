import { ReactNode } from 'react';
import { LoadingPage } from '@pagopa-pn/pn-commons';

const LoadingPageWrapper = ({
  children,
  isInitialized = false,
}: {
  children: ReactNode;
  isInitialized?: boolean;
}) => (
  <>
    {!isInitialized && (
      <LoadingPage
        sx={{ position: 'absolute', width: '100%', zIndex: 3, backgroundColor: 'white' }}
      />
    )}
    {children}
  </>
);

export default LoadingPageWrapper;
