import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Navigate } from "react-router-dom";
import Animator from "../animator/Animator";
import { getAllTradeRequestsById } from "./apiTrade";
import TradeHistoryItem from "./TradeHistoryItem";

interface TradeHistoryProps {
  userId?: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ userId }) => {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([{}]);

  useEffect(() => {
    const user = isAuthenticated().user;
    const userIdValue = user._id;
    const username = user.name;
    
    if (
      isAuthenticated()._id !== userId &&
      user.role !== "admin"
    ) {
      setRedirectToHome(true);
    } else {
      Animator.animate();
    }

    getAllTradeRequestsById(userIdValue).then((data) => {
      if (data) {
        data.forEach((line, i) => {
          if (line.tradeSender.name !== username) {
            data[i].name = line.tradeSender.name;
          } else {
            data[i].name = line.tradeReceiver.name;
          }
        });
        setHistoryData(data);
      } else {
        setHistoryData([]);
      }
    });
  }, [userId]);

  if (redirectToHome) return <Navigate to="/" />;

  return (
    <div className="container-fluid">
      <div className="row my-3 justify-content-center">
        {/* BgSidebar is col-sm-3 */}
        <TradesSideBar highlight="TradeHistory" />
        <div className="col-sm-6 col-lg-6 animator">
          <h4>Trade History</h4>

          <table className="table">
            <thead>
              <tr>
                <th scope="col justify-content-center">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {historyData && historyData.length > 0 ? (
                historyData.map((line, index) => {
                  return (
                    <TradeHistoryItem
                      key={index}
                      name={line.name}
                      status={line.status}
                      createdDate={line.createdDate}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No History Available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
