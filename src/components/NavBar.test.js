import { render, screen } from "@testing-library/react";
import NavBar from "./NavBar";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter } from "react-router-dom";

test("renders correctly", () => {
  const { queryByTestId, getByText } = render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
  expect(queryByTestId("postsLink")).toBeTruthy();
});
