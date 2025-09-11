import React, { createContext, useContext, ReactNode } from "react";

// Define event interface based on the selectedEvent structure from CalContainer
interface Event {
  _id: string;
  title: string;
  allDay: boolean;
  description: string;
  startDate: Date;
  endDate: Date;
  owner: string | { _id: string; name: string };
  bgColor: string;
  boardgames: any[];
  tempBoardgame: string;
}

// Define the context value interface
interface EventContextValue {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedEvent: Event;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event>>;
}

// Default event object
const defaultEvent: Event = {
  _id: "",
  title: "",
  allDay: false,
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  owner: "",
  bgColor: "eventTag-Blue",
  boardgames: [],
  tempBoardgame: "",
};

// Create context with proper default values
const EventContext = createContext<EventContextValue>({
  events: [],
  setEvents: () => {},
  selectedEvent: defaultEvent,
  setSelectedEvent: () => {},
});

// Custom hook to use EventContext
export const useEvents = (): EventContextValue => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

// Provider component props interface
interface EventProviderProps {
  children: ReactNode;
  initialSelectedEvent?: Partial<Event>;
}

// EventProvider component
export const EventProvider: React.FC<EventProviderProps> = ({ 
  children,
  initialSelectedEvent = {}
}) => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event>({
    ...defaultEvent,
    ...initialSelectedEvent,
  });

  const value = React.useMemo(
    () => ({
      events,
      setEvents,
      selectedEvent,
      setSelectedEvent,
    }),
    [events, selectedEvent]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export { EventContext };
