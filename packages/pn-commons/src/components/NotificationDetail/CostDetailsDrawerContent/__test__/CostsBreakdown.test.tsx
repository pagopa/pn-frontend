import {
  NotificationCostDetails,
  NotificationCostDetailsStatus,
} from '../../../../models/NotificationDetail';
import { initLocalizationForTest, render } from '../../../../test-utils';
import CostsBreakdown from '../CostsBreakdown';

describe('CostsBreakdown component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('should render base cost, analog cost, and total cost when status is OK', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.OK,
      totalCost: 1050,
      baseCost: 200,
      analogCost: 850,
      numberOfAnalogCost: 1,
    };

    const { getByTestId, getAllByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    const costsBreakdown = getByTestId('costs-breakdown');
    expect(costsBreakdown).toBeInTheDocument();

    const costRows = getAllByTestId('cost-row');
    expect(costRows).toHaveLength(2);

    const totalRow = getByTestId('cost-row-total');
    expect(totalRow).toBeInTheDocument();
  });

  it('should render hint with "avoided" message when analogCost is 0', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.OK,
      totalCost: 200,
      baseCost: 200,
      analogCost: 0,
      numberOfAnalogCost: 0,
    };

    const { getByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    const hint = getByTestId('cost-hint');
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveTextContent(
      'notifiche - notification-alert.details.analog-cost.hint.avoided'
    );
  });

  it('should render hint with "multiple analog flows" message when numberOfAnalogCost > 1', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.OK,
      totalCost: 1050,
      baseCost: 200,
      analogCost: 850,
      numberOfAnalogCost: 3,
    };

    const { getByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    const hint = getByTestId('cost-hint');
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveTextContent(
      'notifiche - notification-alert.details.analog-cost.hint.multiple-analog-flows'
    );
  });

  it('should not render hint when analogCost > 0 and numberOfAnalogCost is 1', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.OK,
      totalCost: 1050,
      baseCost: 200,
      analogCost: 850,
      numberOfAnalogCost: 1,
    };

    const { queryByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    expect(queryByTestId('cost-hint')).not.toBeInTheDocument();
  });

  it('should not render baseCost row when baseCost is undefined', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.OK,
      totalCost: 850,
      analogCost: 850,
      numberOfAnalogCost: 1,
    };

    const { getAllByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    // Only analog cost row (no base cost row)
    const costRows = getAllByTestId('cost-row');
    expect(costRows).toHaveLength(1);
  });

  it('should return null when status is ERROR', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.ERROR,
      totalCost: 1050,
      baseCost: 200,
      analogCost: 850,
    };

    const { queryByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    expect(queryByTestId('costs-breakdown')).not.toBeInTheDocument();
  });

  it('should render when status is UNAVAILABLE', () => {
    const costDetails: NotificationCostDetails = {
      status: NotificationCostDetailsStatus.UNAVAILABLE,
      totalCost: 1050,
      baseCost: 200,
      analogCost: 850,
    };

    const { getByTestId } = render(<CostsBreakdown costDetails={costDetails} />);

    expect(getByTestId('costs-breakdown')).toBeInTheDocument();
  });
});
