import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Footer from "./Footer";

describe("Footer", () => {
  it("renders a footer", () => {
    render(<Footer />);

    const copyright = screen.getByText("© 2018 Gandalf");

    expect(copyright).toBeInTheDocument();
  });
});
