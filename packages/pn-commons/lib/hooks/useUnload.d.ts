/**
 * This hook is designed to allow you to execute a function when
 * the user is about to navigate away from the current page or close
 * the browser tab/window.
 * It uses the beforeunload event to accomplish this.
 * @example
 * import { useUnload } from './useUnload';
    function MyComponent() {
      useUnload(() => {
        // Your cleanup or confirmation logic here
      });

      // Rest of your component code
    }
 * @param {() => any} fn:() => any
 * @returns {any}
 */
export declare const useUnload: (fn: () => any) => void;
