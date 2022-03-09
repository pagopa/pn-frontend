import { act, RenderResult } from "@testing-library/react";

import { render } from "../../test-utils";
import AccessDenied from "../AccessDenied";

describe('AccessDenied Component', () => {

  it('renders access denied', async () => {

    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(<AccessDenied />);
    });
    const heading = result?.queryByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Non hai le autorizzazioni necessarie per accedere a questa pagina/i);
  });
});