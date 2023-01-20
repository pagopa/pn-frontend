import { render } from "@testing-library/react";

import PrivacyPolicy from "../PrivacyPolicy";

describe("test the Privacy Policy page",() => {
  test("check that Privacy Policy page container is rendered", () => {
    const result = render(<PrivacyPolicy />);

    expect(result.getByRole('article')).toBeInTheDocument()
  });
});
