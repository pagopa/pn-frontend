import { Typography, Alert, AlertTitle, SvgIcon, Link } from "@mui/material";
import { Box } from "@mui/system";
import { IMAGES_PATH } from "@utils/constants";
import { ITabsData, IInfoblockData, IHeadingTitlesData } from "model";

const IconInfo = () => (
    <SvgIcon
        width="20"
        height="19"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.08398 4.91658H10.9173V6.74992H9.08398V4.91658ZM9.08398 8.58325H10.9173V14.0833H9.08398V8.58325ZM10.0007 0.333252C4.94065 0.333252 0.833984 4.43992 0.833984 9.49992C0.833984 14.5599 4.94065 18.6666 10.0007 18.6666C15.0607 18.6666 19.1673 14.5599 19.1673 9.49992C19.1673 4.43992 15.0607 0.333252 10.0007 0.333252ZM10.0007 16.8333C5.95815 16.8333 2.66732 13.5424 2.66732 9.49992C2.66732 5.45742 5.95815 2.16659 10.0007 2.16659C14.0431 2.16659 17.334 5.45742 17.334 9.49992C17.334 13.5424 14.0431 16.8333 10.0007 16.8333Z"
            fill="#6BCFFB"
        />
    </SvgIcon>
);

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
                        7 giorni
                    </Typography>
                    <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
                        <Typography sx={{ mb: 3 }}>
                            dopo la data in cui ricevi la PEC. Se la ricevi dalle 21:00 in
                            poi, conta a partire dal giorno dopo.
                        </Typography>
                        <Alert color="info" variant="outlined" icon={<IconInfo />}>
                            <AlertTitle>La PEC è satura, non valida o inattiva?</AlertTitle>
                            <Typography variant="body2">
                                In questo caso, la notifica si perfeziona 15 giorni dopo la data
                                di deposito dell’avviso di mancato recapito. Lo trovi su SEND,
                                nel dettaglio della notifica.
                            </Typography>
                        </Alert>
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
                        10 giorni
                    </Typography>
                    <Box sx={{ pr: { lg: "20%", xs: 0 } }}>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            dopo la data in cui ti è stata consegnata.
                        </Typography>
                        <Alert color="info" variant="outlined" icon={<IconInfo />}>
                            <AlertTitle>Hai ricevuto un avviso di giacenza?</AlertTitle>
                            <Typography variant="body2">
                                Se ritiri l’avviso di avventa ricezione entro 10 giorni in
                                Ufficio Postale, conta a partire dalla data di ritiro. Se non lo
                                ritiri entro 10 giorni o non lo ritiri affatto, conta 20 giorni
                                a partire dalla data di consegna dell’avviso di giacenza.
                            </Typography>
                        </Alert>
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
                            a meno che non si sia già perfezionata prima tramite{" "}
                            PEC o raccomandata. Per aprire il
                            messaggio, selezionalo dalla lista e premi “Continua”.
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
    infoblocks
}