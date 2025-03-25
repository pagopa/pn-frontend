import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  EmptyState,
  KnownSentiment,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  formatDate,
  useHasPermissions,
} from '@pagopa-pn/pn-commons';

import { BffVirtualKeysResponse, VirtualKey } from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../models/ApiKeys';
import { PNRole } from '../../models/User';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import ApiKeysDataSwitch from './ApiKeysDataSwitch';

type Props = {
  virtualKeys: BffVirtualKeysResponse;
  handleModalClick: (view: ModalApiKeyView, publicKeyId: string) => void;
  issuerIsActive?: boolean;
  issuerIsPresent?: boolean;
};

const VirtualKeysTable: React.FC<Props> = ({
  virtualKeys,
  handleModalClick,
  issuerIsActive,
  issuerIsPresent,
}) => {
  const { t } = useTranslation(['integrazioneApi']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const isUserAdmin =
    useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]) && !currentUser.hasGroup;

  const data: Array<Row<ApiKeyColumnData>> = virtualKeys.items.map((n: VirtualKey) => {
    const isPersonalKey = n.user?.fiscalCode === currentUser.fiscal_number;

    return {
      ...n,
      name: isPersonalKey
        ? `${n.user?.denomination} (${t('virtualKeys.table.personal')})`
        : n.user?.denomination,
      value: !isUserAdmin || isPersonalKey ? n.value : undefined,
      date: n.lastUpdate ? formatDate(n.lastUpdate, false) : '',
      id: n.id ?? '',
      menu: '',
    };
  });

  const virtualKeysColumns: Array<SmartTableData<ApiKeyColumnData>> = [
    {
      id: 'name',
      label: t('virtualKeys.table.name'),
      tableConfiguration: {
        cellProps: { width: '20%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'value',
      label: t('virtualKeys.table.value'),
      tableConfiguration: {
        cellProps: { width: '41%' },
      },
    },
    {
      id: 'date',
      label: t('virtualKeys.table.lastUpdate'),
      tableConfiguration: {
        cellProps: { width: '15%' },
      },
    },
    {
      id: 'status',
      label: t('virtualKeys.table.status'),
      tableConfiguration: {
        cellProps: { width: '20%' },
      },
      cardConfiguration: {
        position: 'left',
        isCardHeader: true,
        gridProps: { xs: 8 },
      },
    },
    {
      id: 'menu',
      label: '',
      tableConfiguration: {
        cellProps: { width: '5%' },
      },
      cardConfiguration: {
        position: 'right',
        isCardHeader: true,
        gridProps: { xs: 4 },
      },
    },
  ];

  const virtualKeysVisibleColumns = isUserAdmin ? virtualKeysColumns : virtualKeysColumns.slice(1);

  if (!virtualKeys || virtualKeys.items.length === 0) {
    return (
      <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('virtualKeys.empty-state')}</EmptyState>
    );
  }

  return (
    <SmartTable
      data={data}
      conf={virtualKeysVisibleColumns}
      sortLabels={{
        title: t('sort.title', { ns: 'notifiche' }),
        optionsTitle: t('sort.options', { ns: 'notifiche' }),
        cancel: t('sort.cancel', { ns: 'notifiche' }),
        asc: t('sort.asc', { ns: 'notifiche' }),
        dsc: t('sort.desc', { ns: 'notifiche' }),
      }}
      testId="virtualKeysTable"
      slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
    >
      <SmartHeader>
        {virtualKeysVisibleColumns.map((column) => (
          <SmartHeaderCell
            key={column.id.toString()}
            columnId={column.id}
            sortable={column.tableConfiguration.sortable}
            cellProps={column.tableConfiguration.cellProps}
          >
            {column.label}
          </SmartHeaderCell>
        ))}
      </SmartHeader>
      <SmartBody>
        {data.map((row, index) => (
          <SmartBodyRow key={row.id} index={index} testId="virtualKeysBodyRow">
            {virtualKeysVisibleColumns.map((column) => (
              <SmartBodyCell
                key={column.id.toString()}
                columnId={column.id}
                tableProps={column.tableConfiguration}
                cardProps={column.cardConfiguration}
                isCardHeader={column.cardConfiguration?.isCardHeader}
              >
                <ApiKeysDataSwitch
                  data={row}
                  keys={virtualKeys}
                  type={column.id}
                  handleModalClick={handleModalClick}
                  menuType="virtualKeys"
                  issuerIsActive={issuerIsActive}
                  issuerIsPresent={issuerIsPresent}
                />
              </SmartBodyCell>
            ))}
          </SmartBodyRow>
        ))}
      </SmartBody>
    </SmartTable>
  );
};

export default VirtualKeysTable;
