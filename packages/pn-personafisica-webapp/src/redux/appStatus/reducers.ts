import { createSlice } from "@reduxjs/toolkit";
import { AppCurrentStatus, DowntimeLogPage } from "../../models/appStatus";
import { getCurrentStatus, getDowntimeLogPage } from "./actions";

interface AppStatusData {
  currentStatus?: AppCurrentStatus;
  incidentsPage?: DowntimeLogPage;
};

/* eslint-disable functional/immutable-data */
const appStatusSlice = createSlice<AppStatusData, any>({
  name: "appStatusSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentStatus.fulfilled, (state, action) => {
      state.currentStatus = action.payload;
    });
    builder.addCase(getDowntimeLogPage.fulfilled, (state, action) => {
      state.incidentsPage = action.payload;
    });
  }
});

export default appStatusSlice;
