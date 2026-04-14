import { testFormElements } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import ShowPublicKeyParams from '../NewPublicKey/ShowPublicKeyParams';

describe('ShowPublicKeyParams', () => {
  it('render component', async () => {
    const { container, getByTestId, queryByTestId } = render(
      <ShowPublicKeyParams params={{ kid: 'mocked-kid', issuer: 'mocked-issuer' }} />
    );
    expect(container).toHaveTextContent('new-public-key.steps.get-returned-parameters.title');
    expect(container).toHaveTextContent('new-public-key.steps.get-returned-parameters.description');
    testFormElements(
      container,
      'kid',
      'new-public-key.steps.get-returned-parameters.kid',
      'mocked-kid'
    );
    testFormElements(
      container,
      'issuer',
      'new-public-key.steps.get-returned-parameters.issuer',
      'mocked-issuer'
    );
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    const previousButton = queryByTestId('previous-step');
    expect(previousButton).not.toBeInTheDocument();
  });

  it('click on submit button', () => {
    const { getByTestId, router } = render(
      <ShowPublicKeyParams params={{ kid: 'mocked-kid', issuer: 'mocked-issuer' }} />
    );
    const submitButton = getByTestId('step-submit');
    fireEvent.click(submitButton);
    expect(router.state.location.pathname).toBe(routes.INTEGRAZIONE_API);
  });
});
