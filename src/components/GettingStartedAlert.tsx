import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getUser } from "../user/apiUser";

const useStyles = styled((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function GettingstartedAlert() {
  const classes = useStyles();

  const [hasSynced, setSync] = useState(false);
  if (isAuthenticated()) {
    getUser(isAuthenticated().user._id, isAuthenticated().token).then(
      (person) => {
        if (person.bggUsername) {
          setSync(true);
        } else {
          setSync(false);
        }
      }
    );

    return (
      <div className={classes.root}>
        {!hasSynced ? (
          <Alert severity="info" color="info">
            <Link
              to={"/user/edit/bgg/" + isAuthenticated().user._id}
              className="primary"
            >
              Get Started
            </Link>{" "}
            by syncing your BoardGameGeeks Account.
          </Alert>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
}
