import { useEffect } from 'react';
export function downloadDocument(url) {
    /* eslint-disable functional/immutable-data */
    window.location.href = url;
}
// There are no tests for this hook, since for such a test either the document
// or the downloadDocument action.
// For the former, jest offers no simple way to do it.
// For the latter, we were adding a parameter just for testing.
// Hence the decision of not producing tests of this hook
// -------------------------------
// Carlos Lombardi and Andrea Cimini, 2022.11.17
// -------------------------------
export function useDownloadDocument({ url, clearDownloadAction }) {
    useEffect(() => {
        if (url) {
            downloadDocument(url);
            if (clearDownloadAction) {
                clearDownloadAction();
            }
        }
    }, [url, clearDownloadAction]);
    return null;
}
