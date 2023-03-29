import { styled } from "@mui/material";

/** H3 tag styled like H6. Used to fix accessibility issue with heading elements not in a sequentially-descending order.  */
const CustomH3 = styled('h3')({
  fontSize: '24px',
  fontWeight: 600,
  marginTop: 0
});


export default CustomH3;