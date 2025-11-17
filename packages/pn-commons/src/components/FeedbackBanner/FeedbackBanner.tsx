import React, { ReactNode, useId } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardProps, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type LinkAction = {
  /** Render the CTA as an anchor element (external or internal link). */
  kind: 'link';
  text: string;
  href: string;
  target?: '_self' | '_blank';
};

type ButtonAction = {
  /** Render the CTA as a button that executes a custom callback. */
  kind: 'button';
  text: string;
  onClick: () => void;
};

/**
 * Action configuration:
 * - `kind: "link"`   → renders a `<ButtonNaked>` as an `<a>` with `href`
 * - `kind: "button"` → renders a `<ButtonNaked>` with an `onClick` handler
 */
type Action = LinkAction | ButtonAction;

type CardSlotProps = CardProps & {
  'data-testid'?: string;
};

type SlotProps = {
  card?: CardSlotProps;
};

type Props = {
  /** Banner title, visually rendered as heading (Typography h2). */
  title: string;
  /** Banner body content. Accepts plain text or any custom React node. */
  content: string | ReactNode;
  /** CTA configuration: either a link (`kind: "link"`) or a button (`kind: "button"`). */
  action: Action;
  /**
   * Accessible label for the banner region.
   * If not provided, the banner will be labelled by the title via `aria-labelledby`.
   */
  ariaLabel?: string;
  /** Optional slots to customize internal elements (currently only the Card wrapper). */
  slotProps?: SlotProps;
};

const FeedbackBanner: React.FC<Props> = ({ title, content, action, ariaLabel, slotProps }) => {
  const titleId = useId();
  const a11yProps = ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId };

  const renderAction = () => {
    if (action.kind === 'link') {
      const isBlank = action.target === '_blank';

      return (
        <ButtonNaked
          component="a"
          href={action.href}
          target={action.target ?? '_self'}
          rel={isBlank ? 'noopener noreferrer' : undefined}
          sx={{ marginTop: 1.5, fontSize: 16, color: '#0B3EE3' }}
        >
          {action.text}
        </ButtonNaked>
      );
    }

    return (
      <ButtonNaked onClick={action.onClick} sx={{ marginTop: 1.5, fontSize: 16, color: '#0B3EE3' }}>
        {action.text}
      </ButtonNaked>
    );
  };

  const baseCardSx = {
    p: 2,
    borderRadius: 3,
    background: '#E7ECFC',
    borderColor: '#CED8F9',
  } as const;

  const cardSlot = slotProps?.card ?? {};
  const { sx: cardSx, ...cardRest } = cardSlot;

  return (
    <Card component="section" {...a11yProps} {...cardRest} sx={{ ...baseCardSx, ...cardSx }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box pt={0.5}>
          <EditIcon fontSize="small" sx={{ color: '#9DB2F4' }} />
        </Box>
        <Box>
          <Typography id={titleId} component="h2" variant="subtitle1" sx={{ fontSize: '16px' }}>
            {title}
          </Typography>

          {typeof content === 'string' ? (
            <Typography variant="body2" fontSize={14}>
              {content}
            </Typography>
          ) : (
            content
          )}

          {renderAction()}
        </Box>
      </Stack>
    </Card>
  );
};

export default FeedbackBanner;
