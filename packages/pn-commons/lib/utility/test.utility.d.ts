import { IAppMessage } from '../models';
type AppState = {
    loading: {
        result: boolean;
        tasks: any;
    };
    messages: {
        errors: Array<IAppMessage>;
        success: Array<IAppMessage>;
    };
};
type ApiOutcomeTestHelperType = {
    errorMessageForAction: (action: string) => IAppMessage;
    appStateWithMessageForAction: (action: string) => AppState;
};
export declare const apiOutcomeTestHelper: ApiOutcomeTestHelperType;
export {};
