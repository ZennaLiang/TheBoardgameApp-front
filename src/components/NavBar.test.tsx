import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./NavBar";

const renderNavBar = () =>
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

test("NavBar has Sign In link", () => {
  renderNavBar();
  expect(screen.getByText("Sign In")).toBeTruthy();
});

test("NavBar has Sign Up link", () => {
  renderNavBar();
  expect(screen.getByText("Sign Up")).toBeTruthy();
});
