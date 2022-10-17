import { render } from "@testing-library/react";

import PrivacyPolicy from "../PrivacyPolicy";

describe("test the Privacy Policy page",() => {
  test("test the Privacy Policy page rendering", () => {
    const result = render(<PrivacyPolicy />);

    expect(result.baseElement).toHaveTextContent("Privacy Policy");
    expect(result.baseElement).toHaveTextContent("Cookie policy");
  });
});
