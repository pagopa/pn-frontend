import {
  PGAddMandateSuccessEventData,
  PGMandateSuccessPayload,
} from '../../../models/PGEventPayloads';

export const mapAddMandateSuccessToEventPayload = ({
  personType,
  partySelection,
}: PGAddMandateSuccessEventData): PGMandateSuccessPayload => ({
  person_type: personType,
  mandate_type: partySelection === 'tuttiGliEnti' ? 'all' : 'selected_party',
});
