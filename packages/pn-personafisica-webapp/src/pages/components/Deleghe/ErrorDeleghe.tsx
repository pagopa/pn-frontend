
import { Grid, Typography, Box, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTranslation } from 'react-i18next';

class ErrorDelega {
    title: string;
    description: string;
    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
}

type ErrorDelegheProps = {
    errorType: number;
};

const ErrorDeleghe: React.FC<ErrorDelegheProps> = ({ errorType }) => {

    const { t } = useTranslation(['errorCreationNewMandatory']);

    const errors = [
        new ErrorDelega("Connessione Interrotta", "La tua richiesta non è stata inviata. Controlla che il tuo dispositivo sia connesso a una rete e riprova."),
        new ErrorDelega("Delega già presente", "La persona che hai indicato ha già una delega per questo ente."),
        new ErrorDelega("Il servizio non è disponibile", "Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi."),
    ];


    return (
            <Box>
                <Alert
                    className="userToast"
                    icon={<ErrorOutlineIcon sx={{ my: "auto", color: "black" }} />
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
                            <Typography sx={{ fontWeight: '600' }}>
                                {t(errors[errorType].title)}
                            </Typography>
                            <Typography>
                                {t(errors[errorType].description)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Alert>
            </Box>
    );
};

export default ErrorDeleghe;