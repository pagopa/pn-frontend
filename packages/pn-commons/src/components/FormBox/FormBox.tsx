import { Box } from "@mui/material";
import { ReactNode } from "react";

export const FormBox = ({ testid, children }: { testid?: string; children: ReactNode }) => (
    <Box
      data-testid={testid}
      sx={{
        borderRadius: '8px',
        borderColor: 'divider',
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: 3,
        marginTop: 2,
      }}
    >
      {children}
    </Box>
  );