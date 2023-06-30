import { List, ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IMAGES_PATH } from "@utils/constants";
import { IHeadingTitlesData, IInfoblockData, ITabsData } from "model";

const headingTitles: Array<IHeadingTitlesData> = [
  {
    name: "heading title notification viewed 1",
    data: {
      title: "Quando si perfeziona una notifica?",
      subtitle: (
        <>
          Dipende dal modo in cui la si riceve: seleziona i canali per sapere
          quando avviene il perfezionamento.
        </>
      ),
    },
  },
];

const tabs: Array<ITabsData> = [
  {
    name: "tabs notification viewed 1",
    data: {
      tabs: ["PEC", "Raccomandata", "App IO", "SEND", "Email o SMS"],
    },
  },
];

const infoblocks: Array<IInfoblockData> = [
  {
    name: "infoblock notification viewed 1",
    data: {
      title: "",
      inverse: false,
      image: `${IMAGES_PATH}/pf-notification-viewed-1.png`,
      imageShadow: false,
      content: (
        <>
          <Typography variant="overline">LA NOTIFICA SI PERFEZIONA</Typography>
          <Typography variant="h4" color="primary">
            dopo 7 o 15 giorni
          </Typography>
          <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              <ListItem sx={{ display: "list-item", pl: 0, pt: 0, pb: 0.5 }}>
                <Typography variant="body2">
                  <b>Se hai ricevuto la PEC</b>, si perfeziona 7 giorni dopo la
                  data di consegna. Se l'hai ricevuta dalle 21:00 in poi, conta
                  a partire dal giorno dopo.
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", pl: 0, pt: 0, pb: 0.5 }}>
                <Typography variant="body2">
                  <b>Se la PEC è satura, non valida o inattiva</b>, si
                  perfeziona 15 giorni dopo la data di emissione dell'avviso di
                  mancato recapito. Lo troverai su SEND, nel dettaglio della
                  notifica.
                </Typography>
              </ListItem>
            </List>
          </Box>
        </>
      ),
    },
  },
  {
    name: "infoblock notification viewed 2",
    data: {
      title: "",
      inverse: false,
      image: `${IMAGES_PATH}/pf-notification-viewed-2.png`,
      imageShadow: false,
      content: (
        <>
          <Typography variant="overline">LA NOTIFICA SI PERFEZIONA</Typography>
          <Typography variant="h4" color="primary">
            dopo 10 o 20 giorni
          </Typography>
          <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              <ListItem sx={{ display: "list-item", pl: 0, pt: 0, pb: 0.5 }}>
                <Typography variant="body2">
                  <b>Se hai ricevuto la raccomandata</b>, si perfeziona 10
                  giorni dopo la data di ricezione;
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", pl: 0, pt: 0, pb: 0.5 }}>
                <Typography variant="body2">
                  <b>
                    Se hai ricevuto un avviso di giacenza e ritiri la
                    raccomandata
                  </b>{" "}
                  entro 10 giorni, si perfeziona 10 giorni dopo la data di
                  ritiro;
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", pl: 0, pt: 0, pb: 0.5 }}>
                <Typography variant="body2">
                  <b>
                    Se hai ricevuto un avviso di giacenza e non ritiri la
                    raccomandata
                  </b>{" "}
                  entro 10 giorni, si perfeziona 20 giorni dopo la data di
                  ricezione dell'avviso di giacenza.
                </Typography>
              </ListItem>
            </List>
          </Box>
        </>
      ),
    },
  },
  {
    name: "infoblock notification viewed 3",
    data: {
      title: "",
      inverse: false,
      image: `${IMAGES_PATH}/pf-notification-viewed-3.png`,
      imageShadow: false,
      content: (
        <>
          <Typography variant="overline">LA NOTIFICA SI PERFEZIONA</Typography>
          <Typography variant="h4" color="primary">
            il giorno in cui apri il messaggio
          </Typography>
          <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
            <Typography variant="body2" sx={{ mb: 3 }}>
              che hai ricevuto su IO dal servizio “Notifiche digitali” di SEND,
              a meno che non si sia già perfezionata prima tramite PEC o
              raccomandata. Per aprire il messaggio, selezionalo dalla lista e
              premi “Continua”.
            </Typography>
          </Box>
        </>
      ),
    },
  },
  {
    name: "infoblock notification viewed 4",
    data: {
      title: "",
      inverse: false,
      image: `${IMAGES_PATH}/pf-notification-viewed-4.png`,
      imageShadow: false,
      content: (
        <>
          <Typography variant="overline">LA NOTIFICA SI PERFEZIONA</Typography>
          <Typography variant="h4" color="primary">
            il giorno in cui la visualizzi
          </Typography>
          <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
            <Typography variant="body2">
              dopo avere effettuato l’accesso con SPID o CIE e avere premuto
              sulla notifica, a meno che non si sia già perfezionata prima
              tramite PEC o raccomandata.
            </Typography>
          </Box>
        </>
      ),
    },
  },
  {
    name: "infoblock notification viewed 5",
    data: {
      title: "",
      inverse: false,
      image: `${IMAGES_PATH}/pf-notification-viewed-5.png`,
      imageShadow: false,
      content: (
        <>
          <Typography variant="overline">LA NOTIFICA SI PERFEZIONA</Typography>
          <Typography variant="h4" color="primary">
            il giorno in cui la visualizzi
          </Typography>
          <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
            <Typography variant="body2">
              su SEND, dopo avere effettuato l’accesso con SPID o CIE e avere
              premuto sulla notifica, a meno che non si sia già perfezionata
              prima tramite PEC o raccomandata.
            </Typography>
          </Box>
        </>
      ),
    },
  },
];

export const perfezionamentoData = {
  headingTitles,
  tabs,
  infoblocks,
};
