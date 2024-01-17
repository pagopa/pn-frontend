import { createSlice } from '@reduxjs/toolkit';
import { createAppResponseError, createAppResponseSuccess } from '../../utility/AppResponse';
import { createAppMessage } from '../../utility/message.utility';
const initialState = {
    loading: {
        result: false,
        tasks: {},
    },
    messages: {
        errors: [],
        success: [],
    },
    responseEvent: null,
    isInitialized: false,
};
const isLoading = (action) => action.type.endsWith('/pending');
const isFulfilled = (action) => action.type.endsWith('/fulfilled');
const handleError = (action) => action.type.endsWith('/rejected');
function doRemoveErrorsByAction(action, errors) {
    return errors.filter((e) => e.action !== action);
}
/* eslint-disable functional/immutable-data */
export const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        addError(state, action) {
            const message = createAppMessage(action.payload.title, action.payload.message, action.payload.status, action.payload.action);
            state.messages.errors.push(message);
        },
        removeError(state, action) {
            state.messages.errors = state.messages.errors.filter((e) => e.id !== action.payload);
        },
        removeErrorsByAction(state, action) {
            state.messages.errors = doRemoveErrorsByAction(action.payload, state.messages.errors);
        },
        setErrorAsAlreadyShown(state, action) {
            const error = state.messages.errors.find((e) => e.id === action.payload);
            if (error) {
                error.alreadyShown = true;
            }
        },
        addSuccess(state, action) {
            const message = createAppMessage(action.payload.title, action.payload.message, action.payload.status);
            state.messages.success.push(message);
        },
        removeSuccess(state, action) {
            state.messages.success = state.messages.success.filter((e) => e.id !== action.payload);
        },
        finishInitialization(state) {
            state.isInitialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isLoading, (state, action) => {
            if (!action.meta || !action.meta.blockLoading) {
                state.loading.result = true;
            }
        })
            .addMatcher(isFulfilled, (state, action) => {
            state.loading.result = false;
            const actionBeingFulfilled = action.type.slice(0, action.type.indexOf('/'));
            state.messages.errors = doRemoveErrorsByAction(actionBeingFulfilled, state.messages.errors);
            const response = createAppResponseSuccess(actionBeingFulfilled, action.payload?.response);
            state.responseEvent = { outcome: 'success', name: actionBeingFulfilled, response };
        })
            .addMatcher(handleError, (state, action) => {
            state.loading.result = false;
            const actionBeingRejected = action.type.slice(0, action.type.indexOf('/'));
            state.messages.errors = doRemoveErrorsByAction(actionBeingRejected, state.messages.errors);
            const response = createAppResponseError(actionBeingRejected, action.payload.response);
            state.responseEvent = { outcome: 'error', name: actionBeingRejected, response };
        });
    },
});
export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;
export const appStateSelectors = {
    selectLoading: (state) => state.appState.loading.result,
    selectErrors: (state) => state.appState.messages.errors,
    selectSuccess: (state) => state.appState.messages.success,
    selectIsInitialized: (state) => state.appState.isInitialized,
};
