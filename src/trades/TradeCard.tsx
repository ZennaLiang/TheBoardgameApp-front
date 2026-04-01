import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { logger } from "../utils/logger";

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

const changeStore = (item, selected, listName, onSelectionChange?: (count: number) => void) => {
  let tradeData: unknown[] = [];
  const raw = sessionStorage.getItem(listName);
  if (raw) {
    try {
      tradeData = JSON.parse(raw);
    } catch {
      tradeData = [];
    }
  }
  if (selected) {
    tradeData.push(item);
  } else {
    tradeData.pop();
  }
  sessionStorage.setItem(listName, JSON.stringify(tradeData));
  onSelectionChange?.(tradeData.length);
};

interface TradeCardProps {
  bg: {
    condition: string;
    boardgame: { title: string };
    tags: string[];
  };
  onSelectionChange?: (count: number) => void;
  [key: string]: unknown;
}

const TradeCard: React.FC<TradeCardProps> = (props) => {
  const [selected, setSelected] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const listIdName = (e.currentTarget.parentElement as HTMLElement).id;
    changeStore(props, !selected, listIdName, props.onSelectionChange);
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
