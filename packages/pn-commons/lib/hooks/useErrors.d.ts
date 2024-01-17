/**
 * A custom React hook for handling and checking API errors in the application state.
 *
 * @returns {Object} An object containing the `hasApiErrors` function.
 */
export declare function useErrors(): {
    hasApiErrors: (actionType?: string) => boolean;
};
