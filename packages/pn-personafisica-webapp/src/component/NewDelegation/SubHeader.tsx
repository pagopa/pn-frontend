import { PnBreadcrumb, TitleBox } from "@pagopa-pn/pn-commons";
import { Fragment } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as routes from "../../navigation/routes.const";

const SubHeader = () => {
    const { t } = useTranslation(['deleghe', 'common']);
    
    return (
        <>
            <PnBreadcrumb
                goBackLabel={t('button.indietro', { ns: 'common' })}
                linkRoute={routes.DELEGHE}
                linkLabel={
                    <Fragment>
                        <PeopleIcon sx={{ mr: 0.5 }} />
                        {t('nuovaDelega.title')}
                    </Fragment>
                }
                currentLocationLabel={t('nuovaDelega.breadcrumb')}
            />
            <TitleBox
                title={t('nuovaDelega.title')}
                subTitle={t('nuovaDelega.subtitle')}
                variantTitle="h3"
                variantSubTitle="body1"
                sx={{ pt: '20px' }}
            />
            <Typography sx={{ my: '1rem'}}>
                {t('nuovaDelega.form.mandatoryField')}
            </Typography>
        </>
    );
};

export default SubHeader;