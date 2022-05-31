import { Box, Button, Typography } from "@mui/material";
import { IllusCompleted } from "@pagopa/mui-italia";
import { useNavigate } from "react-router-dom";

import * as routes from "../../../navigation/routes.const";

const SyncFeedback = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex'}}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        <IllusCompleted />
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          La notifica è stata correttamente creata 
        </Typography>
        <Typography variant="body1" color="text.primary">
           Trovi gli aggiornamenti sul suo stato nella sezione &quot;Notifiche&quot;
        </Typography>
        <Button variant="contained" sx={{ marginTop: '30px' }} onClick={() => navigate(routes.DASHBOARD)}>
          Vai alle Notifiche
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedback;
