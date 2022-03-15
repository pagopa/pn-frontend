import { Stack, styled, Box, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useEffect, useState } from "react";
import FindInPageIcon from '@mui/icons-material/FindInPage';
type GenericErrorProps = {
    title?: number;
    description?: number;
};
import { Button } from '@mui/material';
import { useAppDispatch } from '../../redux/hooks';
import { delegations } from '../../redux/delegation/actions';

const GenericError: React.FC<GenericErrorProps> = ({ title, description }) => {

    const dispatch = useAppDispatch();

    const retryApiCall = () => {
        void dispatch(delegations());
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: "3rem" }}>
            <FindInPageIcon sx={{ fontSize: '5rem' }} />
            <Typography variant={"h4"} align={"center"}>
                Spiacenti, qualcosa è andato <br></br> storto
            </Typography>
            <Typography align={"center"}>
                Non siamo riusciti ad indirizzarti alla pagina richiesta
            </Typography>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#0173e6', height: '32px', marginTop: '1rem' }}
                onClick={retryApiCall}
            >
                Ricarica la pagina
            </Button>
        </Box>
    );
};

export default GenericError;
