import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal Component - accessibility tests', () => {
  it('is Confirmation Modal component accessible', async () => {
    const result = render(
      <ConfirmationModal
        title={'Test title'}
        onClose={() => {}}
        onCloseLabel="Cancella"
        open={true}
        onConfirm={() => {}}
        onConfirmLabel="Conferma"
      />
    );
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
