
import { Grid, Typography, Box, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorDeleghe = () => {
    console.log("Componente di errore");
    return (
        <>
            {
                /*
            <Box sx={{ width:"480px", height: "104px"}}>
                <Grid container>
                    <Grid item xs={2} sx={{ backgroundColor: "blue"}}>
                        <Typography sx={{ marginTop: "1rem" }}>Icona</Typography>
                    </Grid>
                    <Grid item xs={10} sx={{ margin: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: "pink" }}>
                            <Typography sx={{ marginTop: "1rem" }}>Testo da metgtere doop</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>            
                */
            }
            <Box>
                <Alert
                    className="userToast"
                    icon={                        <ErrorOutlineIcon sx={{my:"auto", color:"black"}}/>
                    }
                    sx={{
                        width: '480px',
                        height: '104px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        borderLeft: "red",
                        borderStyle: 'solid',
                        borderWidth: '0px',
                        borderLeftWidth: '4px',
                        boxShadow: '0px 0px 45px rgba(0, 0, 0, 0.1) '
                    }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography sx={{fontWeight: '600' }}>
                                Esempio titolo
                            </Typography>
                            <Typography>Esempio messaggio</Typography>
                        </Grid>
                    </Grid>
                </Alert>
            </Box>
        </>
    );
};

export default ErrorDeleghe;