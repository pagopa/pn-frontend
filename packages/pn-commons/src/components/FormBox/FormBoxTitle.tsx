import { SxProps, Theme, Typography, TypographyProps } from "@mui/material";


type Props = {
  text: string;
  sx?: SxProps<Theme>;
  variantType?: TypographyProps['variant'];
  id?: string;
};

export const FormBoxTitle = ({ text, sx, variantType, id }:Props) => (
    <Typography sx={{ ...sx }} variant={variantType} id={id}>
      {text}
    </Typography>
  );