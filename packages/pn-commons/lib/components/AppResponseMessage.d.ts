/// <reference types="react" />
import { AppResponseError } from '../models/AppResponse';
/**
 * AppResponseMessage that subscribes to error messages using an AppResponsePublisher
 * and dispatches those error messages to the Redux store using useDispatch from react-redux.
 * This component is designed to display error messages in your React application.
 * Make sure that you have the necessary Redux setup and reducers in place for this code to work correctly.
 * @returns {any}
 */
type Props = {
    eventTrackingToastErrorMessages?: (error: AppResponseError, traceid?: string) => void;
};
declare const AppResponseMessage: ({ eventTrackingToastErrorMessages }: Props) => JSX.Element;
export default AppResponseMessage;
