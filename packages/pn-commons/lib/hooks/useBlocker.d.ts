import type { Blocker } from 'history';
/**
 * This hook allows you to control route blocking behavior in your React
 * application when certain conditions are met,
 * providing a way to customize how route transitions are handled.
 * @param {any} blocker:Blocker
 * @param {any} when=true
 * @returns {any}
 */
export declare function useBlocker(blocker: Blocker, when?: boolean): void;
