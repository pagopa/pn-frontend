import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Row,
} from '@pagopa-pn/pn-commons';

import { ApiKey, ModalApiKeyView } from '../../models/ApiKeys';
import * as routes from '../../navigation/routes.const';
import ApiKeyDataSwitch from './ApiKeyDataSwitch';

type Props = {
  apiKeys: Array<ApiKey>;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
  children?: React.ReactNode;
};

const LinkNewApiKey: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      key="new-api-key"
      data-testid="link-new-api-key"
      onClick={() => navigate(routes.NUOVA_API_KEY)}
    >
      {children}
    </Link>
  );
};

const DesktopApiKeys = ({ apiKeys, handleModalClick }: Props) => {
  const { t } = useTranslation(['apikeys']);

  const rows: Array<Row<ApiKey>> = apiKeys.map((n: ApiKey, index) => ({
    ...n,
    id: index.toString(),
  }));

  const columns: Array<Column<ApiKey & { contextMenu: string }>> = [
    {
      id: 'name',
      label: t('table.name'),
      cellProps: { width: '30%' },
      sortable: false,
    },
    {
      id: 'value',
      label: t('table.api-key'),
      cellProps: { width: '25%' },
      sortable: false,
    },
    {
      id: 'lastUpdate',
      label: t('table.last-update'),
      cellProps: { width: '15%' },
    },
    {
      id: 'groups',
      label: t('table.groups'),
      cellProps: { width: '15%' },
    },
    {
      id: 'status',
      label: t('table.status'),
      cellProps: { width: '10%', align: 'left' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'contextMenu',
      label: '',
      cellProps: { width: '5%', align: 'left' },
      sortable: false,
    },
  ];

  return (
    <>
      {apiKeys && apiKeys.length > 0 ? (
        <PnTable testId="tableApiKeys" ariaTitle={t('table.title')}>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell key={column.id} columnId={column.id} sortable={column.sortable}>
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
          <PnTableBody>
            {rows.map((row, index) => (
              <PnTableBodyRow key={row.id} index={index} testId="tableApiKeys.body.row">
                {columns.map((column) => (
                  <PnTableBodyCell key={column.id} cellProps={column.cellProps}>
                    <ApiKeyDataSwitch
                      type={column.id}
                      data={row}
                      handleModalClick={handleModalClick}
                    />
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
        </PnTable>
      ) : (
        <EmptyState data-testid="emptyState">
          <Trans
            ns={'apikeys'}
            i18nKey={'empty-message'}
            components={[<LinkNewApiKey key={'LinkNewApiKey'} />]}
          />
        </EmptyState>
      )}
    </>
  );
};

export default DesktopApiKeys;
