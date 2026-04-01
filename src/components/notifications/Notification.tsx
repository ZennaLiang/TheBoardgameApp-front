import React, { useEffect } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Card from "./Card";
import { Link } from "react-router-dom";

interface NotificationItem {
  id: string;
  link: string;
  isRead: boolean;
  name: string;
  type: string;
}

//Red notification marker to be fixed with Context is implemented
export default function Notification(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [hasNew, setHasNew] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const local = localStorage.getItem("notifications");

    props.notificationsObj.then(result => {
      if (local === null) {
        setNotifications(result);
        localStorage.setItem("notifications", JSON.stringify(result));
        setHasNew(true);
        setIsLoading(false);
      } else {
        let localNotifications: NotificationItem[] = [];
        try {
          localNotifications = JSON.parse(local);
        } catch {
          localNotifications = [];
        }
        if (localNotifications.length === result.length) {
          setHasNew(false);
          setNotifications(localNotifications);
          setIsLoading(false);
        } else {
          const diff = result.filter(
            ({ id: id1 }) =>
              !localNotifications.some(({ id: id2 }) => id2 === id1)
          );

          diff.forEach(item => {
            localNotifications.push(item);
          });

          setHasNew(true);
          setNotifications(localNotifications);
          setIsLoading(false);
          localStorage.setItem(
            "notifications",
            JSON.stringify(localNotifications)
          );
        }
      }
    });
  }, [props.notificationsObj]);

  const handleClickOpen = event => {
    setAnchorEl(event.currentTarget);
    setHasNew(false);
  };

  const handleClose = value => {
    setAnchorEl(null);
  };

  const handleClickCard = (id: string) => {
    const raw = localStorage.getItem("notifications");
    if (!raw) return;
    try {
      const localNotifications: NotificationItem[] = JSON.parse(raw);
      const foundIdx = localNotifications.findIndex(el => el.id === id);
      if (foundIdx !== -1) {
        localNotifications[foundIdx].isRead = true;
        localStorage.setItem("notifications", JSON.stringify(localNotifications));
      }
    } catch {
      // corrupted storage, ignore
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-label="notification" onClick={handleClickOpen}>
        {hasNew ? (
          <Badge badgeContent={" "} color="secondary">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <h3 className="p-3 pt-2" style={{ textDecoration: "underline" }}>
          Notifications
        </h3>
        <div className="container">
          {isLoading
            ? "Loading..."
            : notifications.map((item, i) => {
                return (
                  <Link key={i} to={item.link}>
                    <Card
                      handleClickCard={() => handleClickCard(item.id)}
                      isRead={item.isRead}
                      name={item.name}
                      nType={item.type}
                    ></Card>
                  </Link>
                );
              })}
        </div>
      </Popover>
    </div>
  );
}
