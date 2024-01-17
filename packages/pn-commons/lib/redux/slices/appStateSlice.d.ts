import { PayloadAction } from '@reduxjs/toolkit';
import { AppResponse, IAppMessage } from '../../models';
import { AppResponseOutcome } from '../../models/AppResponse';
export interface AppStateState {
    loading: {
        result: boolean;
        tasks: {
            [taskId: string]: boolean;
        };
    };
    messages: {
        errors: Array<IAppMessage>;
        success: Array<IAppMessage>;
    };
    responseEvent: {
        outcome: AppResponseOutcome;
        name: string;
        response: AppResponse;
    } | null;
    isInitialized: boolean;
}
export declare const appStateSlice: import("@reduxjs/toolkit").Slice<AppStateState, {
    addError(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: {
        payload: {
            title: string;
            message: string;
            status?: number | undefined;
            action?: string | undefined;
        };
        type: string;
    }): void;
    removeError(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    removeErrorsByAction(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    setErrorAsAlreadyShown(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    addSuccess(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<{
        title: string;
        message: string;
        status?: number;
    }>): void;
    removeSuccess(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    finishInitialization(state: import("immer/dist/internal").WritableDraft<AppStateState>): void;
}, "appState">;
export declare const appStateActions: import("@reduxjs/toolkit").CaseReducerActions<{
    addError(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: {
        payload: {
            title: string;
            message: string;
            status?: number | undefined;
            action?: string | undefined;
        };
        type: string;
    }): void;
    removeError(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    removeErrorsByAction(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    setErrorAsAlreadyShown(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    addSuccess(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<{
        title: string;
        message: string;
        status?: number;
    }>): void;
    removeSuccess(state: import("immer/dist/internal").WritableDraft<AppStateState>, action: PayloadAction<string>): void;
    finishInitialization(state: import("immer/dist/internal").WritableDraft<AppStateState>): void;
}>;
export declare const appStateReducer: import("redux").Reducer<AppStateState>;
export declare const appStateSelectors: {
    selectLoading: (state: any) => any;
    selectErrors: (state: any) => any;
    selectSuccess: (state: any) => any;
    selectIsInitialized: (state: any) => any;
};
