import { render, screen } from "@testing-library/react";
import App from "./App";

// Recharts' ResponsiveContainer needs ResizeObserver, which jsdom lacks.
beforeAll(() => {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
});

it("renders the overview with real KPIs and working footer links", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: /marketing mix model/i })).toBeInTheDocument();
  expect(screen.getByText("0.643")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Methodology" })).toHaveAttribute("href", "/data");
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
  expect(screen.queryByAltText(/marketing data/i)).toBeNull();
});
