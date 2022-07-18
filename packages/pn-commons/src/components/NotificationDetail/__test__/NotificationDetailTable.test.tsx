import { RenderResult } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailTableRow } from '../../../types';
import NotificationDetailTable from '../NotificationDetailTable';

describe('NotificationDetailTable Component', () => {
  let result: RenderResult | undefined;

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

  beforeEach(() => {
    // render component
    result = render(<NotificationDetailTable rows={detailRows}/>);
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders NotificationDetailTable', () => {
    const table = result?.container.querySelector('table');
    expect(table).toBeInTheDocument(); 
    expect(table).toHaveAttribute('aria-label', 'Dettaglio notifica');
    const rows = table?.querySelectorAll('tr');
    expect(rows).toHaveLength(detailRows.length);
    rows?.forEach((row, index) => {
      const columns = row.querySelectorAll('td');
      expect(columns).toHaveLength(2);
      expect(columns[0]).toHaveTextContent(detailRows[index].label);
      expect(columns[1]).toHaveTextContent(detailRows[index].value as string);
    });
  });
});