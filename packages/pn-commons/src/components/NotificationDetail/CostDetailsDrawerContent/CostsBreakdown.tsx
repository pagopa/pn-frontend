import { SavingsOutlined } from '@mui/icons-material';
import { Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';

import { formatEurocentToCurrency } from '../../../utility';

// Questa interfaccia andrà ridefinita e importata da BFF su pf-webapp
interface CostDetails {
  status: 'OK' | 'UNAVAILABLE' | 'ERROR';
  totalCost?: number;
  baseCost?: number;
  firstAnalogCost?: {
    cost: number;
    productType: string;
  };
  secondAnalogCost?: {
    cost: number;
    productType: string;
  };
  simpleRegisteredLetterCost?: {
    cost: number;
    productType: string;
  };
}

const CostRow = ({
  label,
  amount,
  hint,
  isTotal,
}: {
  label: string;
  amount: string;
  hint?: string;
  isTotal?: boolean;
}) => (
  <ListItem
    disableGutters
    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
  >
    <ListItemText
      primary={label}
      primaryTypographyProps={{ variant: 'body1', fontSize: '16px', fontWeight: 600 }}
      secondary={
        hint ? (
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }} gap={0.5}>
            <SavingsOutlined sx={{ fontSize: 16, color: '#5517E3' }} />
            {hint}
          </Box>
        ) : undefined
      }
      secondaryTypographyProps={{ variant: 'caption', color: '#5517E3' }}
    />
    <Typography
      color={isTotal ? 'inherit' : 'primary'}
      variant={isTotal ? 'h6' : 'body1'}
      fontSize={isTotal ? '24px' : '16px'}
      fontWeight={isTotal ? 'bold' : 600}
    >
      {amount}
    </Typography>
  </ListItem>
);

const CostsBreakdown = ({ costDetails }: { costDetails: CostDetails }) => {
  if (costDetails.status !== 'OK' && costDetails.status !== 'UNAVAILABLE') {
    return null;
  }

  const firstAnalogCost = costDetails.firstAnalogCost?.cost || 0;

  // TODO -> Sul figma le cifre vengono riportate senza decimali (es. 200 -> 2 € e non 2,00 €)

  return (
    <List disablePadding>
      {costDetails.baseCost !== undefined && (
        <CostRow label="Costo base" amount={formatEurocentToCurrency(costDetails.baseCost, true)} />
      )}
      <CostRow
        label="Costo invio cartaceo"
        amount={formatEurocentToCurrency(firstAnalogCost, true)}
        hint={firstAnalogCost === 0 ? 'Invio evitato con SEND' : undefined}
      />
      {costDetails.secondAnalogCost && (
        <CostRow
          label="Secondo invio cartaceo"
          amount={formatEurocentToCurrency(costDetails.secondAnalogCost.cost, true)}
        />
      )}
      {costDetails.simpleRegisteredLetterCost && (
        <CostRow
          label="Raccomandata semplice"
          amount={formatEurocentToCurrency(costDetails.simpleRegisteredLetterCost.cost, true)}
        />
      )}
      <Divider />
      {costDetails.totalCost && (
        <CostRow
          label="Totale"
          amount={formatEurocentToCurrency(costDetails.totalCost, true)}
          isTotal
        />
      )}
    </List>
  );
};

export default CostsBreakdown;
