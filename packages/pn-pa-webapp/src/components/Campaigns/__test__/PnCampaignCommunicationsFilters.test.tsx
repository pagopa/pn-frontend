import { vi } from 'vitest';

import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';
import { testFormElements } from '@pagopa-pn/pn-commons/src/test-utils';

import { comunicationsList } from '../../../__mocks__/CampaignDetail.mock';
import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { communicationStatusOptions } from '../../../models/Campaign';
import PnCampaignCommunicationsFilters from '../PnCampaignCommunicationsFilters';

const informalIun = comunicationsList.resultsPage![0].iun!;

const mockHandleChangeTouched = vi.fn();
const mockHandlePaste = vi.fn();
const mockSetFieldValue = vi.fn();

const createFormik = ({
  values = {},
  touched = {},
  errors = {},
}: {
  values?: Partial<{
    recipientId: string;
    iunMatch: string;
    status: Array<InformalNotificationStatus>;
    outcome: string;
  }>;
  touched?: Record<string, boolean>;
  errors?: Record<string, string>;
} = {}) => ({
  values: {
    recipientId: '',
    iunMatch: '',
    status: [],
    outcome: '',
    ...values,
  },
  touched,
  errors,
  setFieldValue: mockSetFieldValue,
});

const renderFilters = (formik = createFormik()) =>
  render(
    <PnCampaignCommunicationsFilters
      formik={formik}
      handleChangeTouched={mockHandleChangeTouched}
      handlePaste={mockHandlePaste}
    />
  );

describe('PnCampaignCommunicationsFilters', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filters with empty values', () => {
    const { container } = renderFilters();

    testFormElements(container, 'recipientId', 'detail.communications.tax-id', '');
    testFormElements(container, 'iunMatch', 'detail.communications.iun', '');
    testFormElements(container, 'status', 'detail.communications.status', '');
    testFormElements(container, 'outcome', 'detail.communications.outcome', '');
    expect(screen.getByTestId('communicationOutcome')).toHaveTextContent(
      'detail.communications.outcomes.all'
    );
  });

  it('renders filters with formik values', () => {
    const { container } = renderFilters(
      createFormik({
        values: {
          recipientId: 'CLMCST42R12D969Z',
          iunMatch: informalIun,
          status: [
            InformalNotificationStatus.COMPLETED_UNREACHED,
            InformalNotificationStatus.COMPLETED_REACHED,
          ],
          outcome: 'viewed',
        },
      })
    );

    testFormElements(container, 'recipientId', undefined, 'CLMCST42R12D969Z');
    testFormElements(container, 'iunMatch', undefined, informalIun);
    testFormElements(container, 'status', undefined, 'detail.communications.statuses.success');
    testFormElements(container, 'outcome', undefined, 'viewed');
    expect(screen.getByTestId('communicationOutcome')).toHaveTextContent(
      'detail.communications.outcomes.viewed'
    );
  });

  it('shows errors only for touched fields', () => {
    renderFilters(
      createFormik({
        touched: { recipientId: true },
        errors: {
          recipientId: 'detail.communications.errors.tax-id',
          iunMatch: 'filters.errors.iun',
        },
      })
    );

    expect(screen.getByLabelText('detail.communications.tax-id')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByText('detail.communications.errors.tax-id')).toBeInTheDocument();
    expect(screen.getByLabelText('detail.communications.iun')).toHaveAttribute(
      'aria-invalid',
      'false'
    );
    expect(screen.queryByText('filters.errors.iun')).not.toBeInTheDocument();
  });

  it('shows IUN error when the field is touched', () => {
    renderFilters(
      createFormik({
        touched: { iunMatch: true },
        errors: {
          recipientId: 'detail.communications.errors.tax-id',
          iunMatch: 'filters.errors.iun',
        },
      })
    );

    expect(screen.getByLabelText('detail.communications.iun')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByText('filters.errors.iun')).toBeInTheDocument();
    expect(screen.getByLabelText('detail.communications.tax-id')).toHaveAttribute(
      'aria-invalid',
      'false'
    );
    expect(screen.queryByText('detail.communications.errors.tax-id')).not.toBeInTheDocument();
  });

  it('sets the status field value when a status option is selected', async () => {
    renderFilters();

    fireEvent.click(screen.getByLabelText('detail.communications.status'));

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(communicationStatusOptions.length);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(communicationStatusOptions[index].label);
    });

    fireEvent.click(options[2]);

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    });
    expect(mockSetFieldValue).toHaveBeenCalledWith('status', [
      InformalNotificationStatus.COMPLETED_REACHED,
      InformalNotificationStatus.COMPLETED_UNREACHED,
    ]);
  });

  it('resets the status field value when the status is cleared', async () => {
    renderFilters(
      createFormik({
        values: {
          status: [InformalNotificationStatus.ACCEPTED],
        },
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'autocomplete.clear' }));

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    });
    expect(mockSetFieldValue).toHaveBeenCalledWith('status', []);
  });
});
