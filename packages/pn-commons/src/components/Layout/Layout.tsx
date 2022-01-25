import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Footer, Header } from "@pagopa/selfcare-common-frontend";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* <Header withSecondHeader={!!party} subHeaderChild={party && <DashboardMenuContainer />} /> */}
      <Header withSecondHeader={true} />

      <Grid container direction="row" flexGrow={1}>
        {children}
      </Grid>
      <Footer />
    </Box>
  );
}
