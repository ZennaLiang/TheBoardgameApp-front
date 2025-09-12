import React, { useState } from "react";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getUser } from "../user/apiUser";

export default function GettingstartedAlert() {

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
      <Box sx={{ width: "100%", "& > * + *": { marginTop: 2 } }}>
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
      </Box>
    );
  } else {
    return null;
  }
}
