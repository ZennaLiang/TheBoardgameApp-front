import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import TradeRequest from "./TradeRequest";
import TradePending from "./TradePending";
import { Navigate } from "react-router-dom";
import {
  getAllTradeRequestsById,
  deleteTrade,
  updateTradeStatus
} from "./apiTrade";
import Animator from "../animator/Animator";

interface TradesProps {
  userId: string;
}

const Trades: React.FC<TradesProps> = ({ userId }) => {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [tradeResponses, setTradeResponses] = useState<any[]>([]);
  const [tradeRequests, setTradeRequests] = useState<any[]>([]);
  const [tradePending, setTradePending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      const userId = isAuthenticated().user._id;
      try {
        const data = await getAllTradeRequestsById(userId);
        if (data) {
          console.log(data);
          const outgoingRequests = data.filter(
            (trade: any) =>
              userId === trade.tradeSender._id &&
              trade.status !== "Pending" &&
              trade.status !== "Closed"
          );
          const incomingRequests = data.filter(
            (trade: any) =>
              userId === trade.tradeReceiver._id &&
              trade.status !== "Pending" &&
              trade.status !== "Closed"
          );
          const pendingRequests = data.filter((trade: any) => trade.status === "Pending");
          setTradeResponses(incomingRequests);
          setTradeRequests(outgoingRequests);
          setTradePending(pendingRequests);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, []);

  useEffect(() => {
    if (
      isAuthenticated()._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      setRedirectToHome(true);
    } else {
      Animator.animate();
    }
  }, [userId]);

  const onClickRemoveTrade = async (tradeId: string) => {
    const token = isAuthenticated().token;
    try {
      const data = await deleteTrade(token, tradeId);
      if (data.error) {
        console.log(data.error);
      } else {
        setTradeRequests(prev => prev.filter(request => request._id !== tradeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickRejectTrade = async (tradeId: string) => {
    const token = isAuthenticated().token;
    try {
      const data = await updateTradeStatus(token, tradeId, "Closed");
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setTradePending(prev => prev.filter(request => request._id !== tradeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickCompleteTrade = async (tradeId: string) => {
    const token = isAuthenticated().token;
    try {
      const data = await updateTradeStatus(token, tradeId, "Complete");
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setTradePending(prev => prev.filter(request => request._id !== tradeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickAcceptTrade = async (tradeId: string) => {
    const token = isAuthenticated().token;
    try {
      const data = await updateTradeStatus(token, tradeId, "Pending");
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setTradePending(prev => prev.filter(request => request._id !== tradeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (redirectToHome) return <Navigate to="/" />;

  return (
    <div className="container-fluid">
      <div className="row my-3 justify-content-center">
        {/* BgSidebar is col-sm-3 */}
        <TradesSideBar highlight="Trades" />
        <div className="col-sm-6 col-lg-6 animator">
          <h4>Active Trades</h4>
          {isLoading ? (
            "Loading..."
          ) : (
            <div>
              <TradeRequest
                trades={tradeRequests}
                onClickDelete={onClickRemoveTrade}
                header="Waiting for Response"
                deleteText="Remove"
              />
              <br />
              <TradeRequest
                trades={tradeResponses}
                onClickAccept={onClickAcceptTrade}
                onClickDelete={onClickRejectTrade}
                header="Response Needed"
                deleteText="Reject"
                successButton="Accept"
              />
              <br />
              <TradePending
                trades={tradePending}
                onClickComplete={onClickCompleteTrade}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Trades;
