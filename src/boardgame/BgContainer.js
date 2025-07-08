import React from "react";
import { isAuthenticated } from "../auth";
import BgSideBar from "./BgSideBar";
import { Navigate } from "react-router-dom";
class BgContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
    };
  }

  componentDidMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }
  }

  render() {
    const { redirectToHome } = this.state;
    if (redirectToHome) return <Navigate to="/" />;

    return (
      <div className="container-fluid px-0">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <BgSideBar
            highlight={this.props.sidebar}
            userId={this.props.userId}
          />
          <div className="col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-0 mr-0">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default BgContainer;
