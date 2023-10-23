import React from 'react';

import { Button } from '@mui/material';

import { NotificationDetailTableRow } from '../../../models';
import { fireEvent, render, within } from '../../../test-utils';
import NotificationDetailTable from '../NotificationDetailTable';
import NotificationDetailTableAction from '../NotificationDetailTable/NotificationDetailTableAction';
import NotificationDetailTableBody from '../NotificationDetailTable/NotificationDetailTableBody';
import NotificationDetailTableBodyRow from '../NotificationDetailTable/NotificationDetailTableBodyRow';
import NotificationDetailTableCell from '../NotificationDetailTable/NotificationDetailTableCell';
import NotificationDetailTableContents from '../NotificationDetailTable/NotificationDetailTableContents';

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

  const mockActionFn = jest.fn();

  it('renders NotificationDetailTable', () => {
    // render component
    const { getByTestId } = render(
      <NotificationDetailTable>
        <NotificationDetailTableContents label={'Dettaglio notifica'}>
          <NotificationDetailTableBody>
            {detailRows.map((row) => (
              <NotificationDetailTableBodyRow key={row.id}>
                <NotificationDetailTableCell
                  id={`row-label-${row.id}`}
                  cellProps={{ py: { xs: 0, lg: 1 } }}
                >
                  {row.label}
                </NotificationDetailTableCell>
                <NotificationDetailTableCell
                  id={`row-value-${row.id}`}
                  cellProps={{ pb: 1, pt: { xs: 0, lg: 1 } }}
                >
                  {row.value}
                </NotificationDetailTableCell>
              </NotificationDetailTableBodyRow>
            ))}
          </NotificationDetailTableBody>
        </NotificationDetailTableContents>
        <NotificationDetailTableAction>
          <Button data-testid="actionButton" onClick={() => mockActionFn()}>
            mock-action-button
          </Button>
        </NotificationDetailTableAction>
      </NotificationDetailTable>
    );
    const table = getByTestId('notificationDetailTable');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-label', 'Dettaglio notifica');
    const rows = within(table!).getAllByTestId('notificationDetailTableRow');
    expect(rows).toHaveLength(detailRows.length);
    rows.forEach((row, index) => {
      const columns = within(row).getAllByRole('cell');
      expect(columns).toHaveLength(2);
      expect(columns[0]).toHaveTextContent(detailRows[index].label);
      expect(columns[1]).toHaveTextContent(detailRows[index].value as string);
    });
    const button = getByTestId('actionButton');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockActionFn).toBeCalledTimes(1);
  });
});
