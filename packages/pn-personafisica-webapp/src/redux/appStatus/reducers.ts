import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppStatusData } from "@pagopa-pn/pn-commons";
import { getCurrentAppStatus, getDowntimeLegalFactDocumentDetails, getDowntimeLogPage } from "./actions";

/* eslint-disable functional/immutable-data */
const appStatusSlice = createSlice({
  name: "appStatusSlice",
  initialState: {
    /*
      The "nextPage" included in the return value of the API is just an index.
      Moreover, when the last page is requested, the "nextPage" has still a value
      namely the same page which was requested.
      Therefore, if the only page is requested, the "nextPage" will have a "0" value.
      To ease the implementation, I decided to include the first page in the
      list of pages, and to initialize such array with that page (which has a "0" index). 
     */
      pagination: { size: 10, page: 0, resultPages: ["0"] }
  } as AppStatusData,
  reducers: {
    clearLegalFactDocumentData: (state) => {
      delete state.legalFactDocumentData;
    },
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.resultPages = ["0"];
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
    clearPagination: (state) => {
      state.pagination = { size: 10, page: 0, resultPages: ["0"] };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentAppStatus.fulfilled, (state, action) => {
      state.currentStatus = action.payload;
    });
    builder.addCase(getDowntimeLogPage.fulfilled, (state, action) => {
      state.downtimeLogPage = action.payload;
      if (action.payload.nextPage && !state.pagination.resultPages.includes(action.payload.nextPage)) {
        state.pagination.resultPages.push(action.payload.nextPage);
      }
    });
    builder.addCase(getDowntimeLegalFactDocumentDetails.fulfilled, (state, action) => {
      state.legalFactDocumentData = action.payload;
    });
  }
});

export const { clearLegalFactDocumentData, clearPagination, setPagination } = appStatusSlice.actions;

export default appStatusSlice;
