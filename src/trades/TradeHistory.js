import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Navigate } from "react-router-dom";
import Animator from "../animator/Animator";
import { getAllTradeRequestsById } from "./apiTrade";
import TradeHistoryItem from "./TradeHistoryItem";
class TradeHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToHome: false,
      historyData: [{}],
    };
  }
  componentWillMount() {}

  componentDidMount() {
    let userId = isAuthenticated().user._id;
    let username = isAuthenticated().user.name;
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    } else {
      Animator.animate();
    }

    getAllTradeRequestsById(userId).then((data) => {
      if (data) {
        data.forEach((line, i) => {
          if (line.tradeSender.name !== username) {
            data[i].name = line.tradeSender.name;
          } else {
            data[i].name = line.tradeReceiver.name;
          }
          this.setState({ historyData: data });
        });
      } else {
        this.setState({ historyData: null });
      }
    });
  }

  render() {
    const { redirectToHome } = this.state;
    if (redirectToHome) return <Navigate to="/" />;

    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar highlight="TradeHistory" />
          <div className="col-sm-6 col-lg-6 animator">
            <h4>Trade History</h4>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col justify-content-center">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {this.state.historyData ? (
                  this.state.historyData.map((line) => {
                    return (
                      <TradeHistoryItem
                        name={line.name}
                        status={line.status}
                        createdDate={line.createdDate}
                      />
                    );
                  })
                ) : (
                  <div>No History Available.</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default TradeHistory;
