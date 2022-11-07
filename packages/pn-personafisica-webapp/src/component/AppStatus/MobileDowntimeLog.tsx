import { CardElement, Item, ItemsCard } from "@pagopa-pn/pn-commons";
import { DowntimeLogPage } from "@pagopa-pn/pn-commons";
import { adaptFieldSpecToMobile, useFieldSpecs } from "./downtimeLog.utils";

export const MobileDowntimeLog = ({ downtimeLog }: { downtimeLog: DowntimeLogPage }) => {
  const { getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec, getStatusFieldSpec, getRows } = useFieldSpecs();

  const cardHeader: [CardElement, CardElement | null] = [
    {
      ...adaptFieldSpecToMobile(getStatusFieldSpec()),
      label: '',
    },
    null,
  ];

  const cardBody: Array<CardElement> = [
    adaptFieldSpecToMobile(getDateFieldSpec('startDate', false)),
    adaptFieldSpecToMobile(getDateFieldSpec('endDate', false)),
    adaptFieldSpecToMobile(getFunctionalityFieldSpec()),
    adaptFieldSpecToMobile(getLegalFactIdFieldSpec()),
  ];

  /* eslint-disable-next-line sonarjs/no-identical-functions */
  const rows: Array<Item> = getRows(downtimeLog);

  return <ItemsCard
    cardHeader={cardHeader}
    cardBody={cardBody}
    cardData={rows}
    headerGridProps={{ justifyContent: "center" }}
  />;
};
