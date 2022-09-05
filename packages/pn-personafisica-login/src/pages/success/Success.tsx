import { useEffect } from "react";
import { storageOriginOps } from "../../utils/storage";

const SuccessPage = () => {
  const originUrl = storageOriginOps.read();
  const token = window.location.hash;

  useEffect(() => {
    if (originUrl) {
      storageOriginOps.delete();

      /* eslint-disable-next-line functional/immutable-data */
      window.location.replace(originUrl + token);
    }
  }, []);

  return null;
};

export default SuccessPage;