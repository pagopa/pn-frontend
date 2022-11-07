import { createSlice } from "@reduxjs/toolkit";
import { AppCurrentStatus, DowntimeLogPage, LegalFactDocumentDetails } from "@pagopa-pn/pn-commons";
import { getCurrentAppStatus, getDowntimeLegalFactDocumentDetails, getDowntimeLogPage } from "./actions";

interface AppStatusData {
  currentStatus?: AppCurrentStatus;
  downtimeLogPage?: DowntimeLogPage;
  legalFactDocumentData?: LegalFactDocumentDetails;
};

/* eslint-disable functional/immutable-data */
const appStatusSlice = createSlice({
  name: "appStatusSlice",
  initialState: {} as AppStatusData,
  reducers: {
    clearLegalFactDocumentData: (state) => {
      delete state.legalFactDocumentData;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentAppStatus.fulfilled, (state, action) => {
      state.currentStatus = action.payload;
    });
    builder.addCase(getDowntimeLogPage.fulfilled, (state, action) => {
      state.downtimeLogPage = action.payload;
    });
    builder.addCase(getDowntimeLegalFactDocumentDetails.fulfilled, (state, action) => {
      state.legalFactDocumentData = action.payload;
    });
  }
});

export const { clearLegalFactDocumentData } = appStatusSlice.actions;

export default appStatusSlice;
