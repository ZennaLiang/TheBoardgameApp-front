import React from "react";
import renderer from "react-test-renderer";
import SearchUser from "./SearchUser";

describe("<SearchUser />", () => {
  it("render SearchUser", () => {
    const tree = renderer.create(<SearchUser />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
