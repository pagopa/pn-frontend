import { Trans } from 'react-i18next';

import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import { LegalFactId } from '../../../models';

type Props = {
  legalFactsIds: Array<LegalFactId>;
  description: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  slotProps?: {
    button?: MIButtonProps;
  };
};

const NotificationTimelineEventDescription: React.FC<Props> = ({
  legalFactsIds,
  description,
  clickHandler,
  slotProps,
}) => (
  <Trans
    i18nKey="description" // this is fake and is needed to run trans functionality
    t={() => description}
    components={legalFactsIds.map((legalFact) => (
      <MIButton
        {...slotProps?.button}
        key="legalFact"
        variant="text"
        onClick={() => clickHandler(legalFact)}
        sx={{
          textDecoration: 'underline',
          display: 'inline',
          verticalAlign: 'baseline',
          ...slotProps?.button?.sx,
          fontWeight: 400,
        }}
      />
    ))}
  />
);

export default NotificationTimelineEventDescription;
