import type { NextPage } from 'next';
import Head from 'next/head';
import { Hero } from "@pagopa/mui-italia/dist/components/Hero";
import { Showcase } from "@pagopa/mui-italia/dist/components/Showcase";
import {Box} from "@mui/material";
import {CieIcon} from "@pagopa/mui-italia/dist/icons";



const Home: NextPage = () => {
    const showcaseItems = [
        {
            icon: <CieIcon />,
            title: 'First Item',
            subtitle: 'First description',
        }
    ];

    return (
        <>
            <Head>
                <title>Piattaforma Notifiche</title>
                <meta name="description" content="Landing Piattaforma notifiche"/>
                <link rel="icon" href="/favicon.svg"/>
            </Head>

            <main>
                <Hero title="some title"/>
                <Box>Infoblock 1</Box>
                <Box>Infoblock 2</Box>
                <Box>Infoblock 3</Box>
                <Showcase title="Un solo modo per risparmiare in tanti modi" items={showcaseItems}/>
                <Box>Horizontal Nav</Box>
            </main>
        </>
    );
};

export default Home;
