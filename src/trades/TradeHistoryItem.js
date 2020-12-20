import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Helpers from "../helpers";

const renderStatus = status => {
  switch (status) {
    case "Closed":
      return "badge-danger";
    case "Open":
      return "badge-success";
    default:
      return "badge-info";
  }
};

const TradeHistoryItem = props => {
  return (
    <>
      <tr>
        <td>{Helpers.capitalize(props.name)}</td>
        <td>
          <span className={`badge ${renderStatus(props.status)} p-2 w-25`}>
            {props.status}
          </span>
        </td>
        <td>{Helpers.formatDate(props.createdDate)}</td>
      </tr>
    </>
  );
};

export default TradeHistoryItem;
