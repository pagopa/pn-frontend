import { add } from 'date-fns';
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
} from '@pagopa-pn/pn-commons';

import { BffPublicKeysResponse, PublicKeyRow } from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../models/ApiKeys';
import ApiKeysDataSwitch from './ApiKeysDataSwitch';

type Props = {
  publicKeys: BffPublicKeysResponse;
  handleModalClick: (view: ModalApiKeyView, publicKeyId: string) => void;
};

const PublicKeysTable: React.FC<Props> = ({ publicKeys, handleModalClick }) => {
  const { t } = useTranslation(['integrazioneApi']);

  const data: Array<Row<ApiKeyColumnData>> = publicKeys.items.map((n: PublicKeyRow) => ({
    ...n,
    date: n.createdAt ? formatDate(add(new Date(n.createdAt), { days: 355 }).toISOString()) : '',
    id: n.kid ?? '',
    menu: '',
  }));

  const publicKeysColumns: Array<SmartTableData<ApiKeyColumnData>> = [
    {
      id: 'name',
      label: t('publicKeys.table.name'),
      tableConfiguration: {
        cellProps: { width: '24%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'value',
      label: t('publicKeys.table.value'),
      tableConfiguration: {
        cellProps: { width: '24%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'date',
      label: t('publicKeys.table.endDate'),
      tableConfiguration: {
        cellProps: { width: '24%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'status',
      label: t('publicKeys.table.status'),
      tableConfiguration: {
        cellProps: { width: '24%' },
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
        cellProps: { width: '4%' },
      },
      cardConfiguration: {
        position: 'right',
        isCardHeader: true,
        gridProps: { xs: 4 },
      },
    },
  ];

  if (!publicKeys || publicKeys.items.length === 0) {
    return (
      <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('publicKeys.empty-state')}</EmptyState>
    );
  }

  return (
    <SmartTable
      data={data}
      conf={publicKeysColumns}
      sortLabels={{
        title: t('sort.title', { ns: 'notifiche' }),
        optionsTitle: t('sort.options', { ns: 'notifiche' }),
        cancel: t('sort.cancel', { ns: 'notifiche' }),
        asc: t('sort.asc', { ns: 'notifiche' }),
        dsc: t('sort.desc', { ns: 'notifiche' }),
      }}
      testId="publicKeysTable"
    >
      <SmartHeader>
        {publicKeysColumns.map((column) => (
          <SmartHeaderCell
            key={column.id.toString()}
            columnId={column.id}
            sortable={column.tableConfiguration.sortable}
          >
            {column.label}
          </SmartHeaderCell>
        ))}
      </SmartHeader>
      <SmartBody>
        {data.map((row, index) => (
          <SmartBodyRow key={row.id} index={index} testId="publicKeysBodyRow">
            {publicKeysColumns.map((column) => (
              <SmartBodyCell
                key={column.id.toString()}
                columnId={column.id}
                tableProps={column.tableConfiguration}
                cardProps={column.cardConfiguration}
                isCardHeader={column.cardConfiguration?.isCardHeader}
              >
                <ApiKeysDataSwitch
                  data={row}
                  keys={publicKeys}
                  type={column.id}
                  handleModalClick={handleModalClick}
                />
              </SmartBodyCell>
            ))}
          </SmartBodyRow>
        ))}
      </SmartBody>
    </SmartTable>
  );
};

export default PublicKeysTable;
