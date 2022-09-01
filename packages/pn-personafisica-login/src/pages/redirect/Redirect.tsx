import { useEffect } from "react";

const RedirectPage = () => {
  const redirectUrl = sessionStorage.getItem('redirectUrl');
  const token = window.location.hash;

  useEffect(() => {
    if (redirectUrl) {
      sessionStorage.clear();

      /* eslint-disable-next-line functional/immutable-data */
      window.location.replace(redirectUrl + token);
    }
  }, []);

  return null;
};

export default RedirectPage;