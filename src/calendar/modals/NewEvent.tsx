import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";

interface NewEventProps {
  userId?: string;
}

const NewEvent: React.FC<NewEventProps> = (props) => {
  const [event, setEvent] = useState({
    title: "",
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    owner: isAuthenticated().user._id,
    bgColor: "eventTag-blue",
    boardgames: [],
    tempBoardgame: "",
  });

  const reset = () => {
    setEvent({
      title: "",
      allDay: false,
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-blue",
      boardgames: [],
      tempBoardgame: "",
    });
  };

  return (
    <>
      <EventForm
        modalId="add-event"
        modalTitle="Add Event"
        eventInfo={event}
        resetModal={reset}
      />
    </>
  );
};
export default NewEvent;
