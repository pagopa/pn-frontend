import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { RecipientType } from '@pagopa-pn/pn-commons';
import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { PFTriggerEventSpy, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import NuovaDelega from '../../NuovaDelega.page';

vi.mock('../../../utility/delegation.utility', async () => ({
  ...(await vi.importActual<any>('../../../utility/delegation.utility')),
  generateVCode: () => '34153',
}));

describe('NuovaDelega.page - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_MANDATE_DATA_INPUT on mount', async () => {
    await act(async () => {
      render(<NuovaDelega />);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_DATA_INPUT);
  });

  it('fires SEND_ADD_MANDATE_BACK when the back button is clicked', async () => {
    const { getByTestId } = await act(async () => render(<NuovaDelega />));

    fireEvent.click(getByTestId('breadcrumb-indietro-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_BACK);
  });

  it('fires SEND_ADD_MANDATE_UX_CONVERSION on form submit and SEND_ADD_MANDATE_UX_SUCCESS on API success', async () => {
    mock.onPost('/bff/v1/mandate').reply(200);

    const { container, getByTestId } = await act(async () => render(<NuovaDelega />));

    const form = container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'nome', 'Mario');
    await testInput(form, 'cognome', 'Rossi');
    await testInput(form, 'codiceFiscale', 'RSSMRA01A01A111A');
    await testInput(form, 'expirationDate', '01/01/2122');

    await act(async () => {
      fireEvent.click(getByTestId('createButton'));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_UX_CONVERSION, {
      selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
      selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_UX_SUCCESS, {
        person_type: RecipientType.PF,
        mandate_type: 'all',
      });
    });
  });
});
