import { Close } from "@mui/icons-material";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Props {
  type: string;
  value: string;
  isVerified: boolean;
};

const CourtesyContactItem = (props: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);

  // const validationSchema = yup.object({
  //   field: yup.string().required(),
  // });

  // if(props.type === 'email') {
  //   validationSchema.fields.field.email('email errata');
  // } else {
  //   validationSchema.fields.field.matches(/^\[0-9]{3-14}$/, 'telefono errore!');
  // }

  // const formik = useFormik({
  //   initialValues: {
  //     field: props.value
  //   },
  //   validationSchema,
  //   onSubmit: () => {
  //     console.log("submitted");
  //   },
  // });


  if(props.isVerified) {
    return (
      <Fragment>
        <Grid item lg={7} xs={8}>
          <IconButton aria-label="">
            <Close />
          </IconButton>
          <TextField inputProps={{ sx: { height: '12px' } }}>
            {props.value}
          </TextField>
        </Grid>
        <Grid item lg={5} xs={6}>
          <Button variant="text">Text</Button>
        </Grid>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Grid item lg={7} xs={8}>
          <TextField
            fullWidth
            inputProps={{ sx: { height: '12px' } }}
            id={props.value}
            label=""
            variant="outlined"
            placeholder={
              t(`courtesy-contacts.link-${props.type}-placeholder`, { ns: 'recapiti' })
            }
            value={props.value}
          />
        </Grid>
        <Grid item lg={5} xs={6}>
          <Button variant="outlined">{t(`courtesy-contacts.${props.type}-verify`, { ns: 'recapiti' })}</Button>
        </Grid>
      </Fragment>
    );
  }
};

export default CourtesyContactItem;