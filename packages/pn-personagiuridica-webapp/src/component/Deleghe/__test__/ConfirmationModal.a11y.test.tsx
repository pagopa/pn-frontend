import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';

import ConfirmationModal from '../ConfirmationModal';

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('ConfirmationModal Component - accessibility tests', () => {
  it('is Confirmation Modal component accessible', async ()=>{
    const result = render(
      <ConfirmationModal
        title={'Test title'}
        handleClose={() => {}}
        onCloseLabel='Cancella'
        open={true}
        onConfirm={() => {}}
        onConfirmLabel='Conferma'
      />
    );
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
