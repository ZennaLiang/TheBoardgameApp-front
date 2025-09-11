import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React, { useState, useEffect } from "react";
import { getUser } from "../user/apiUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

interface TradesSideBarProps {
  highlight: string;
}

const TradesSideBar: React.FC<TradesSideBarProps> = ({ highlight }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    const init = async (userId: string) => {
      const token = isAuthenticated().token;
      try {
        const data = await getUser(userId, token);
        if (data.error) {
          // Handle error - could redirect to profile
          console.error(data.error);
        } else {
          setName(data.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const userId = isAuthenticated().user._id;
    init(userId);
  }, []);

  return (
    <>
      <div
        className="col-sm-3 col-lg-2 maxSidebarWidth ml-3 justify-content-right mt-5"
      >
        <div className="list-group ">
          <span className="list-group-item list-group-item-dark font-weight-bold">
            Trades
          </span>

          <Link
            className={`btn btn-success text-left my-1 font-weight-bold`}
            to={`/newTrade`}
          >
            <span>
              <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>{" "}
            </span>
            New Trade <span className="sr-only">(current)</span>
          </Link>

          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "Trades" ? "active" : ""
            }`}
            to={`/trades`}
          >
            My Trades <span className="sr-only">(current)</span>
          </Link>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "TradeHistory" ? "active" : ""
            }`}
            to={`/trades/history`}
          >
            Trade History
          </Link>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "TradeSettings" ? "active" : ""
            }`}
            to={`/trades/settings`}
          >
            Trade Settings
          </Link>
        </div>
      </div>
    </>
  );
};
export default TradesSideBar;
