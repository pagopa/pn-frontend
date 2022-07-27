import { useEffect } from "react";
import {Box, Grid, Paper, Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CourtesyPage, useIsMobile } from "@pagopa-pn/pn-commons";
import { IllusCompleted } from "@pagopa/mui-italia";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { resetNewDelegation } from "../redux/newDelegation/actions";
import * as routes from "../navigation/routes.const";
import SubHeader from "../component/NewDelegation/SubHeader";
import NewDelegationForm from "../component/NewDelegation/NewDelegationForm";

const NewDelegation = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { created } = useAppSelector((state: RootState) => state.newDelegationState);

  const handleDelegationsClick = () => {
    navigate(routes.DELEGHE);
  };

  useEffect(() => {
    dispatch(resetNewDelegation());
  }, []);

  return (
    <>
      {!created &&
        <Box
          sx={{
            p: { xs: 3, lg: 0 } ,
              paperContainer: {
              boxShadow: 'none',
            }
          }}
        >
          {isMobile && <SubHeader />}
          <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
            <Grid item lg={8} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && <SubHeader />}
              <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('nuovaDelega.form.personType')}
                </Typography>
                <NewDelegationForm />
              </Paper>
            </Grid>
          </Grid>
        </Box>}
      {created &&
        <CourtesyPage
          icon={<IllusCompleted />}
          title={t('nuovaDelega.createdTitle')}
          subtitle={t('nuovaDelega.createdDescription')}
          onClick={handleDelegationsClick}
          onClickLabel={t('nuovaDelega.backToDelegations')}
        />
      }
      </>
    );
};

export default NewDelegation;