/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { Hero } from "@pagopa/mui-italia";
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { IMAGES_PATH } from "@utils/constants";
import { getFaqData } from "api";
import { FaqDescription, IFaqDataItem, IFaqDataSection } from "model";


type SetActiveItemFunction = (itemId: string) => (_: any, isExpanded: boolean) => void;

type ActiveItemProps = { setActiveItem: SetActiveItemFunction; activeItem: string | null };

/**
 * A separate component to deal with the polymorphism allowed in the definition of a FAQ item description.
 * Cfr. the definition of the type FaqDescription.
 */
function FaqDescriptionBlock(props: { description: FaqDescription }) {
  const { description } = props;

  if (typeof description === 'string') {
    return <Typography variant="body2">{description}</Typography>;
  } else if (Array.isArray(description)) {
    // in fact the wrapping Fragment is just to have JSX.Element as single return type for FaqDescriptionBlock
    return <>
      {description.map((text, ix) => {
        const isLastChild = ix === description.length - 1;
        return <Typography variant="body2" key={ix} sx={isLastChild ? {} : { mb: '12px' }}>{text}</Typography>;
      })}
    </>;
  } else {
    return description;
  }
}

// recall: the FAQ contains many sections, each section contains many items.
// A separate component is defined to render each level in this hierarchy.

function FaqDataItemBlock(props: { item: IFaqDataItem } & ActiveItemProps) {
  const { item, setActiveItem, activeItem } = props;

  return <Box id={item.id} sx={{ mb: '16px' }}>
    <Accordion onChange={setActiveItem(item.id)} expanded={item.id === activeItem}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mr: 4, textAlign: 'justify' }}>
          <FaqDescriptionBlock description={item.description} />
        </Box>
      </AccordionDetails>
    </Accordion>
  </Box>;
}

export function FaqDataSectionBlock(props: { section: IFaqDataSection } & ActiveItemProps) {
  const { section, setActiveItem, activeItem } = props;

  return <Box sx={{ pb: '64px' }}>
    <Typography variant="h4" sx={{ pb: '48px' }}>{section.title}</Typography>
    {section.items.map((item) =>
      <FaqDataItemBlock item={item} setActiveItem={setActiveItem} key={item.id} activeItem={activeItem} />
    )}
  </Box>;
}

const FaqPage: NextPage = () => {
  const router = useRouter();

  const faqData = getFaqData();

  const [currentItem, setCurrentItem] = useState<string | null>(null);

  // if the URL points to a specific item, that item is expanded (besides being shown at window top)
  useEffect(() => {
    const hash = router.asPath.split("#")[1];
    if (hash) {
      setCurrentItem(hash);
    }
  }, [router.asPath]);

  const setActiveItem = useCallback((itemId: string) => (_: any, isExpanded: boolean) => {
    setCurrentItem(isExpanded ? itemId : null);
  }, []);

  return <>
    <Head>
      <title>{faqData.title}</title>
      <meta name="description" content="Pagina di FAQ" />
      <link rel="icon" href="/static/favicon.svg" />
    </Head>

    <main>
      <Hero title="FAQ" type="text" background={`${IMAGES_PATH}/hero-faq-background.png`} />
      <Stack direction="column" sx={{ px: { xs: '30px', sm: '80px', md: '142px' }, pt: '100px', backgroundColor: '#FAFAFA' }}>
        {faqData.sections.map((section, ix) =>
          <FaqDataSectionBlock section={section} key={ix} setActiveItem={setActiveItem} activeItem={currentItem} />
        )}
      </Stack>
    </main>
  </>;
};

export default FaqPage;
