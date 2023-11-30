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
import { UserGroup } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import ApiKeyDataSwitch from './ApiKeyDataSwitch';

type Props = {
  apiKeys: Array<ApiKey<UserGroup>>;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
};

const LinkNewApiKey: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['apikeys']);
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-action-label')}
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

  const rows: Array<Row<ApiKey<UserGroup>>> = apiKeys.map((n: ApiKey<UserGroup>, index) => ({
    ...n,
    id: index.toString(),
  }));

  const columns: Array<Column<ApiKey<UserGroup> & { contextMenu: string }>> = [
    {
      id: 'name',
      label: t('table.name'),
      width: '30%',
      sortable: false,
    },
    {
      id: 'value',
      label: t('table.api-key'),
      width: '25%',
      sortable: false,
    },
    {
      id: 'lastUpdate',
      label: t('table.last-update'),
      width: '15%',
    },
    {
      id: 'groups',
      label: t('table.groups'),
      width: '15%',
    },
    {
      id: 'status',
      label: t('table.status'),
      width: '10%',
      align: 'left',
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'contextMenu',
      label: '',
      width: '5%',
      align: 'left',
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
                  <PnTableBodyCell
                    key={column.id}
                    cellProps={{
                      width: column.width,
                      align: column.align,
                      cursor: 'auto',
                    }}
                  >
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
