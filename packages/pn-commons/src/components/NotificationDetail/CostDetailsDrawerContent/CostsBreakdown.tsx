import { SavingsOutlined } from '@mui/icons-material';
import { Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';

import {
  NotificationCostDetails,
  NotificationCostDetailsStatus,
} from '../../../models/NotificationDetail';
import { formatEurocentToCurrency } from '../../../utility';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

interface Props {
  costDetails: NotificationCostDetails;
}

interface HintMessage {
  text: string;
  variant: 'highlight' | 'default';
}

function buildHintMessage(costDetails: NotificationCostDetails): HintMessage | undefined {
  const { analogCost, numberOfAnalogCost } = costDetails;

  if (!analogCost || analogCost === 0) {
    return {
      text: getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.details.analog-cost.hint.avoided'
      ),
      variant: 'highlight',
    };
  }

  if (numberOfAnalogCost && numberOfAnalogCost > 1) {
    return {
      text: getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.details.analog-cost.hint.multiple-analog-flows',
        undefined,
        { count: numberOfAnalogCost }
      ),
      variant: 'default',
    };
  }

  return undefined;
}

const CostRow = ({
  label,
  amount,
  hint,
  isTotal = false,
}: {
  label: string;
  amount: string;
  hint?: HintMessage;
  isTotal?: boolean;
}) => {
  const isHighlight = hint?.variant === 'highlight';
  const hintColor = isHighlight ? '#5517E3' : 'text.secondary';

  return (
    <ListItem
      disableGutters
      data-testid={isTotal ? 'cost-row-total' : 'cost-row'}
      sx={{
        py: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{ variant: 'body1', fontSize: '16px', fontWeight: 600 }}
        secondary={
          hint ? <HintLabel text={hint.text} color={hintColor} showIcon={isHighlight} /> : undefined
        }
        secondaryTypographyProps={{ variant: 'caption', color: hintColor }}
      />

      <Typography
        data-testid={isTotal ? 'cost-amount-total' : 'cost-amount'}
        color={isTotal ? 'inherit' : 'primary'}
        fontSize={isTotal ? '24px' : '16px'}
        fontWeight={isTotal ? 'bold' : 600}
      >
        {amount}
      </Typography>
    </ListItem>
  );
};

const HintLabel = ({
  text,
  color,
  showIcon,
}: {
  text: string;
  color: string;
  showIcon: boolean;
}) => (
  <Box
    component="span"
    sx={{ display: 'inline-flex', alignItems: 'center' }}
    gap={0.5}
    data-testid="cost-hint"
  >
    {showIcon && <SavingsOutlined sx={{ fontSize: 16, color }} />}
    {text}
  </Box>
);

const CostsBreakdown: React.FC<Props> = ({ costDetails }) => {
  const { status, baseCost, analogCost = 0, totalCost } = costDetails;

  if (
    status !== NotificationCostDetailsStatus.OK &&
    status !== NotificationCostDetailsStatus.UNAVAILABLE
  ) {
    return null;
  }

  return (
    <List disablePadding data-testid="costs-breakdown">
      {baseCost !== undefined && (
        <CostRow
          label={getLocalizedOrDefaultLabel(
            'notifications',
            'notification-alert.details.base-cost'
          )}
          amount={formatEurocentToCurrency(baseCost, true)}
        />
      )}

      <CostRow
        label={getLocalizedOrDefaultLabel(
          'notifications',
          'notification-alert.details.analog-cost.total'
        )}
        amount={formatEurocentToCurrency(analogCost, true)}
        hint={buildHintMessage(costDetails)}
      />

      <Divider sx={{ color: '#E8EBF1' }} />

      {totalCost && (
        <CostRow
          label={getLocalizedOrDefaultLabel(
            'notifications',
            'notification-alert.details.total-cost'
          )}
          amount={formatEurocentToCurrency(totalCost, true)}
          isTotal
        />
      )}
    </List>
  );
};

export default CostsBreakdown;
