import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import BgSideBar from "./BgSideBar";
import { Navigate } from "react-router-dom";

interface BgContainerProps {
  userId?: string;
  sidebar?: any;
  children: React.ReactNode;
}

const BgContainer: React.FC<BgContainerProps> = ({ userId, sidebar, children }) => {
  const [redirectToHome, setRedirectToHome] = useState(false);

  useEffect(() => {
    if (
      userId &&
      isAuthenticated()._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      setRedirectToHome(true);
    }
  }, [userId]);

  if (redirectToHome) return <Navigate to="/" />;

  return (
    <div className="container-fluid px-0">
      <div className="row my-3 justify-content-center">
        {/* BgSidebar is col-sm-3 */}
        <BgSideBar
          highlight={sidebar}
          userId={userId || isAuthenticated().user._id}
        />
        <div className="col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-0 mr-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BgContainer;
