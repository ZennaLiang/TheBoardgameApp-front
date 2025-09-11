import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const conditionBgRender = condition => {
  switch (condition) {
    case "Excellent":
      return "corner-success";
    case "Good":
      return "corner-primary";
    case "Fair":
      return "corner-warning";
    case "Poor":
      return "corner-danger";
    default:
      break;
  }
};

const changeStore = (item, selected, listName) => {
  const tradeData =
    JSON.parse(sessionStorage.getItem(listName)) == null
      ? []
      : JSON.parse(sessionStorage.getItem(listName));
  if (selected) {
    tradeData.push(item);
  } else {
    tradeData.pop(item);
  }
  sessionStorage.setItem(listName, JSON.stringify(tradeData));
  toggleDisabledButton(tradeData);
};

const toggleDisabledButton = list => {
  if (list.length > 0) {
    document.getElementById("reviewTradeButton").classList.remove("disabled");
  } else {
    document.getElementById("reviewTradeButton").classList.add("disabled");
  }
};

const TradeCard = props => {
  const [selected, setSelected] = useState(false);

  const handleClick = e => {
    let listIdName = e.currentTarget.parentElement.id;
    changeStore(props, !selected, listIdName);
    setSelected(!selected);
  };
  return (
    <div className="btn tradeItem border-primary" onClick={e => handleClick(e)}>
      <div className={conditionBgRender(props.bg.condition)}></div>{" "}
      {selected ? (
        <span className="bottomRight">
          <FontAwesomeIcon className="text-success" size="2x" icon={faCheck} />
        </span>
      ) : null}{" "}
      <div>
        <h6>{props.bg.boardgame.title}</h6>
        <hr />
        {props.bg.tags.map((tag, i) => {
          return (
            <span key={i} className="badge badge-info p-1 mx-1">
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TradeCard;
