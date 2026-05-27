import { PGEventPayloads } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';

type MandateFormValues = {
  selectPersonaFisicaOrPersonaGiuridica: 'PF' | 'PG';
  selectTuttiEntiOrSelezionati: string;
};

export const mapAddMandateSuccessToEventPayload = (
  values: MandateFormValues
): PGEventPayloads[PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS] => ({
  person_type: values.selectPersonaFisicaOrPersonaGiuridica,
  mandate_type: values.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? 'all' : 'selected_party',
});
