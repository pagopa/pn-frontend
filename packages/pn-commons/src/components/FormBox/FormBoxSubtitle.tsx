import { SxProps, Theme, Typography, TypographyProps } from "@mui/material";

type Props = {
  text: string;
  sx?: SxProps<Theme>;
  variantType?: TypographyProps['variant'];
  id?: string;
};

export const FormBoxSubtitle = ({ text, sx, variantType, id }:Props) => (
    <Typography sx={{ ...sx }} variant={variantType} id={id} data-testid={id}>
      {text}
    </Typography>
  );
  