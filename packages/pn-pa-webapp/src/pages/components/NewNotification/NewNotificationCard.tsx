import { Fragment, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title: string;
};

const NewNotificationCard = ({children, isContinueDisabled, title}: Props) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Fragment>
      <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
        <Typography variant="h6">{title}</Typography>
        <Box sx={{marginTop: '20px'}}>
          {children}
        </Box>
      </Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{marginTop: '40px', marginBottom: '20px'}}
      >
        <Button variant="outlined" type="button" onClick={handleGoBack}>Torna alle notifiche</Button>
        <Button variant="contained" type="submit" disabled={isContinueDisabled}>Continua</Button>
      </Box>
    </Fragment>
  );
};

export default NewNotificationCard;
