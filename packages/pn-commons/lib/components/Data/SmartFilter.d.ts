import { FormEvent, PropsWithChildren } from 'react';
type Props<FormValues> = {
    /** label to show for the filter button */
    filterLabel: string;
    /** label to show for the cancel button */
    cancelLabel: string;
    /** function to be called when filters are submitted */
    onSubmit: (event?: FormEvent<HTMLFormElement> | undefined) => void;
    /** function to be called when filters are cleaned */
    onClear: () => void;
    /** flag to check if the form is valid */
    formIsValid: boolean;
    /** current form values */
    formValues: FormValues;
    /** initial form values */
    initialValues: FormValues;
};
/**
 * SmartFilter show filter in desktop view and dialog in mobile view.
 */
declare const SmartFilter: <FormValues extends object>({ filterLabel, cancelLabel, onSubmit, onClear, children, formIsValid, formValues, initialValues, }: PropsWithChildren<Props<FormValues>>) => JSX.Element;
export default SmartFilter;
