import { createSlice } from "@reduxjs/toolkit";
import { AppCurrentStatus, IncidentsPage } from "../../models/appStatus";
import { getCurrentStatus, getIncidentsPage } from "./actions";

interface AppStatusData {
  currentStatus?: AppCurrentStatus;
  incidentsPage?: IncidentsPage;
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
    builder.addCase(getIncidentsPage.fulfilled, (state, action) => {
      state.incidentsPage = action.payload;
    });
  }
});

export default appStatusSlice;
