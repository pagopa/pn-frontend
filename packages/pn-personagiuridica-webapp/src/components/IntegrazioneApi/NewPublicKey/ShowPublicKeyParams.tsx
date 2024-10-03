import { useTranslation } from "react-i18next";

import { CopyToClipboardButton } from '@pagopa/mui-italia';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { Box, Stack } from "@mui/system";

import { PublicKeyBaseParams } from '../../../models/ApiKeys';
import NewPublicKeyCard from './NewPublicKeyCard';

type Props = {
    params: PublicKeyBaseParams | undefined;
};

const ShowPublicKeyParams: React.FC<Props> = ({params}) => {
    const { t } = useTranslation(['integrazioneApi', 'common']);

    return (
        <NewPublicKeyCard
            isContinueDisabled={false}
            title={t('new-public-key.steps.get-returned-parameters.title')}
            submitLabel={t('new-public-key.button.end')}
            content={
                <Typography data-testid="content" variant="body1" mt={2}>
                    {t('new-public-key.steps.get-returned-parameters.description')}
                </Typography>
            }
        >
            <Stack direction="column" spacing={5} mt={8}>
                <Box>
                    <InputAdornment position="start" sx={{mb: 2}}>
                        <VpnKeyIcon />
                        <InputLabel sx={{ ml: 1 }} htmlFor="kid">
                            {t('new-public-key.steps.get-returned-parameters.kid')}
                        </InputLabel>
                    </InputAdornment>
                    <TextField
                        id="kid"
                        value={params?.kid}
                        fullWidth={true}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CopyToClipboardButton
                                        color="primary"
                                        value={() => params?.kid || ''}
                                        tooltipTitle={t('new-public-key.kid-copied')}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box>
                    <InputAdornment position="start" sx={{my: 2}}>
                        <AssignmentIndIcon />
                        <InputLabel sx={{ ml: 1 }} htmlFor="issuer">
                            {t('new-public-key.steps.get-returned-parameters.issuer')}
                        </InputLabel>
                    </InputAdornment>
                    <TextField
                        value={params?.issuer}
                        fullWidth={true}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CopyToClipboardButton
                                        color="primary"
                                        value={() => params?.issuer || ''}
                                        tooltipTitle={t('new-public-key.issuer-copied')}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Stack>
        </NewPublicKeyCard>
    );
};

export default ShowPublicKeyParams;