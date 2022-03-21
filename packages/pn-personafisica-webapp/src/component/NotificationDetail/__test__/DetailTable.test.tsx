import { act, RenderResult } from '@testing-library/react';
import { render } from '../../../__test__/test-utils';
import * as hooks from '../../../redux/hooks';
import DetailTable from '../DetailTable';
import { notificationToFe } from '../../../redux/notification/__test__/test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

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
    { label: 'Codice IUN', value: `${notificationToFe.iun}` },
    { label: 'Gruppi', value: '' },
  ];

  beforeEach(async () => {
    // mock useAppSelector
    appSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
    appSelectorSpy.mockReturnValue('mocked-sender');

    // render component
    await act(async () => {
      result = render(<DetailTable notification={notificationToFe}/>);
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it.skip('renders detail table', async () => {
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