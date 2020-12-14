import React from "react";
import NavBar from "./NavBar";
import { BrowserRouter, NavLink } from "react-router-dom";
import { shallow, mount } from "enzyme";
import { render, screen } from "@testing-library/dom";
import "../../setupTests";

const links = [
  { text: "Sign In", location: "/signin" },
  { text: "Sign Up", location: "/signup" }
];
const tree = (
  <BrowserRouter>
    <NavBar />
  </BrowserRouter>
);
test.each(links)("Check if Nav Bar have %s link.", link => {
  //Ensure the text is in the dom, will throw error it can't find

  const linkDom = <NavLink to={link.location}>{link.text}</NavLink>;
  const wrapper = shallow(tree);
  expect(wrapper.find(linkDom)).toBeTruthy();
});

test("Check if NavBar matches snapshot", () => {
  const wrapper = mount(tree);
  expect(wrapper).toMatchSnapshot();
});
