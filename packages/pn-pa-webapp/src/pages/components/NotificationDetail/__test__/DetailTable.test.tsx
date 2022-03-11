import { RenderResult } from '@testing-library/react';

import * as hooks from '../../../../redux/hooks';
import { notificationToFe } from '../../../../redux/notification/__test__/test-utils';
import { render } from '../../../../__test__/test-utils';
import DetailTable from '../DetailTable';

describe('Notification Detail Table Component', () => {
  let result: RenderResult | undefined;
  let appSelectorSpy: jest.SpyInstance;

  const detailTable: Array<{ label: string; value: string }> = [
    { label: 'Data', value: `${notificationToFe.sentAt}` },
    { label: 'Termini di pagamento', value: `Entro il` },
    { label: 'Destinatario', value: `${notificationToFe.recipients[0].taxId}` },
    { label: 'Cognome Nome', value: `${notificationToFe.recipients[0].denomination}` },
    { label: 'Mittente', value: `mocked-sender` },
    { label: 'Codice IUN annullato', value: `${notificationToFe.cancelledIun}` },
    { label: 'Codice IUN', value: `${notificationToFe.cancelledByIun}` },
    { label: 'Gruppi', value: '' },
  ];

  beforeEach(() => {
    // mock useAppSelector
    appSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
    appSelectorSpy.mockReturnValue('mocked-sender');

    // render component
    result = render(<DetailTable notification={notificationToFe}/>);
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders detail table', () => {
    const table = result?.container.querySelector('table');
    expect(table).toBeInTheDocument(); 
    expect(table).toHaveAttribute('aria-label', 'notification detail');
    const rows = table?.querySelectorAll('tr');
    expect(rows).toHaveLength(detailTable.length);
    rows?.forEach((row, index) => {
      const columns = row.querySelectorAll('td');
      expect(columns).toHaveLength(2);
      expect(columns[0]).toHaveTextContent(detailTable[index].label);
      expect(columns[1]).toHaveTextContent(detailTable[index].value);
    });
  });
});