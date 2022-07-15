import { TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import currentLocale from 'date-fns/locale/it';

import { render } from "../../test-utils";
import CustomDatePicker from "../CustomDatePicker";
import {fireEvent} from "@testing-library/react";

const WrappedCustomDatePicker = () => {
    return (
        <LocalizationProvider
            id="startDate"
            name="startDate"
            dateAdapter={AdapterDateFns}
            adapterLocale={currentLocale}
        >
            <CustomDatePicker
                label={"DatePicker"}
                onChange={() => {}}
                value={new Date()}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                            placeholder: 'datepickerinput',
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    )
}

describe("test CustomDatePicker component", () => {
    it('renders the component', () => {
        const result = render(<WrappedCustomDatePicker />)
        const input = result.getByPlaceholderText(/datepickerinput/i)

        expect(result.container).toHaveTextContent(/datepicker/i)
        fireEvent.click(input)
    })
})