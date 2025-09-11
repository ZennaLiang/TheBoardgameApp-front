import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React, { useState, useEffect } from "react";

import { getUser } from "../user/apiUser";

interface BgSideBarProps {
  highlight?: any;
  userId: string;
}

const BgSideBar: React.FC<BgSideBarProps> = ({ highlight, userId }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = (userIdToInit: string) => {
      const token = isAuthenticated().token;
      getUser(userIdToInit, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setName(data.name);
        }
      });
    };

    const currentUserId = isAuthenticated().user._id;
    init(currentUserId);
  }, []);

  return (
    <>
      <div className="col-md-2 col-lg-2 col-xl-2 maxSidebarWidth pl-0 justify-content-right mt-5 pt-4 d-none d-lg-block">
        <div className="list-group ">
          <span className="list-group-item list-group-item-dark font-weight-bold">
            Collections
          </span>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "UserCollection" ? "active" : ""
            }`}
            to={`/collection/bgguru`}
          >
            Guru Collection <span className="sr-only">(current)</span>
          </Link>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "BggCollection" ? "active" : ""
            }`}
            to={`/collection/bgg`}
          >
            BGG Collection
          </Link>
        </div>
      </div>
    </>
  );
};

export default BgSideBar;
