import React from "react";
import "react-datepicker/dist/react-datepicker.css";

import EventForm from "./EventForm";
import { isAuthenticated } from "../../auth";
import { useEvents } from "../../context/EventContext";

const EditEvent: React.FC = () => {
  const { selectedEvent, setSelectedEvent } = useEvents();

  const reset = () => {
    setSelectedEvent({
      _id: "",
      title: "",
      allDay: false,
      startDate: new Date(),
      description: "",
      endDate: new Date(),
      owner: isAuthenticated().user._id,
      bgColor: "eventTag-Blue",
      boardgames: [],
      tempBoardgame: "",
    });
  };

  return (
    <>
      <EventForm
        modalId="edit-event"
        modalTitle="Edit Event"
        eventInfo={selectedEvent}
        resetModal={reset}
      />
    </>
  );
};

export default EditEvent;
