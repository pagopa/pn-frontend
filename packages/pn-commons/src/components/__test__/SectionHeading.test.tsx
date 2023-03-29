import { render, screen } from "@testing-library/react";
import SectionHeading from "../SectionHeading";

describe("SectionHeading component", () => {
  it("renders the provided children", () => {
    const testText = "Test Heading Text";
    render(<SectionHeading>{testText}</SectionHeading>);
    const headingElement = screen.getByText(testText);
    expect(headingElement).toBeInTheDocument();
  });

  it("has the correct font size and weight", () => {
    const testText = "Test Heading Text";
    render(<SectionHeading>{testText}</SectionHeading>);
    const headingElement = screen.getByText(testText);
    expect(headingElement).toHaveStyle("font-size: 1.5rem");
    expect(headingElement).toHaveStyle("font-weight: 600");
  });
});
