import { NotificationDetailTableRow } from '../../../models/NotificationDetail';
import { render, within } from '../../../test-utils';
import NotificationDetailTable from '../NotificationDetailTable';

describe('NotificationDetailTable Component', () => {
  const detailRows: Array<NotificationDetailTableRow> = [
    { id: 1, label: 'Data', value: `mocked-date` },
    { id: 2, label: 'Da pagare entro il', value: `mocked-date` },
    { id: 3, label: 'Codice Fiscale destinatario', value: `mocked-taxId` },
    { id: 4, label: 'Nome e cognome', value: `mocked-denomination` },
    { id: 5, label: 'Mittente', value: `mocked-sender` },
    { id: 6, label: 'Codice IUN annullato', value: `mocked-cancelledIun` },
    { id: 7, label: 'Codice IUN', value: `mocked-iun` },
    { id: 8, label: 'Gruppi', value: '' },
  ];

  it('renders NotificationDetailTable', () => {
    // render component
    const { getByTestId } = render(<NotificationDetailTable rows={detailRows} />);
    const table = getByTestId('notificationDetailTable');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-label', 'Dettaglio notifica');
    const rows = within(table).getAllByTestId('notificationDetailTableRow');
    expect(rows).toHaveLength(detailRows.length);
    rows.forEach((row, index) => {
      const columns = within(row).getAllByRole('cell');
      expect(columns).toHaveLength(2);
      expect(columns[0]).toHaveTextContent(detailRows[index].label);
      expect(columns[1]).toHaveTextContent(detailRows[index].value as string);
    });
  });
});
