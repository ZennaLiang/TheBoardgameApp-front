import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import "./calStyle.css";

import SideBar from "./CalSideBar";
import Calendar from "./Calendar";
import { getEventsByUserId } from "./apiCalendar";
import { isAuthenticated } from "../auth";
import { EventProvider, useEvents } from "../context/EventContext";

//import Animator from "../animator/Animator";

// Inner component that uses the EventContext
const CalendarContent: React.FC<{ userId: string }> = ({ userId }) => {
  const { setEvents } = useEvents();
  const [redirectTo, setRedirectTo] = useState(false);

  useEffect(() => {
    if (userId) {
      getEventsByUserId(userId, isAuthenticated().token).then((data) => {
        if (data.error) {
          setRedirectTo(true);
        } else {
          setEvents(data);
        }
      });
    }
  }, [userId, setEvents]);

  if (redirectTo) {
    return <Navigate to={`/404`} />;
  }

  return (
    <div className="container-fluid calContainer">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <SideBar userId={userId} />
                <Calendar userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalContainer: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  // Initialize the selected event with proper owner ID
  const initialSelectedEvent = {
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-Blue",
  };

  if (!userId) {
    return <Navigate to={`/404`} />;
  }

  return (
    <EventProvider initialSelectedEvent={initialSelectedEvent}>
      <CalendarContent userId={userId} />
    </EventProvider>
  );
};

export default CalContainer;
