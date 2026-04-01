import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { createTrade } from "../apiTrade";
import { isAuthenticated } from "../../auth";
import { Navigate } from "react-router-dom";

interface ConfirmRequestModalProps {
  show: boolean;
  onClose: () => void;
  tradeData: any;
}

const ConfirmRequestModal: React.FC<ConfirmRequestModalProps> = ({
  show,
  onClose,
  tradeData
}) => {
  const [notes, setNotes] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [tradeId, setTradeId] = useState<string | null>(null);

  useEffect(() => {
    //Required to use modal or else it has errors
    ReactModal.setAppElement("body");
  }, []);

  const handleClose = () => {
    onClose && onClose();
  };

  const submitTrade = () => {
    const token = isAuthenticated().token;
    const tradeNotesElement = document.getElementById("tradeNotes") as HTMLTextAreaElement;
    tradeData.notes = tradeNotesElement.value;
    console.log(tradeData);
    createTrade(token, tradeData).then(data => {
      //data returned is only _id of trade
      setRedirect("/requestSent");
      setTradeId(data);
    });
  };

  const style = {
    content: {
      borderRadius: "4px",
      bottom: "100px",
      left: "15%",
      position: "absolute" as const,
      right: "25%",
      top: "100px",
      width: "80%",
      height: "60%"
    }
  };

  const renderConditionBadge = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return (
          <span className="badge badge-success float-right">
            {condition}
          </span>
        );
      case "Good":
        return (
          <span className="badge badge-primary float-right">
            {condition}
          </span>
        );
      case "Fair":
        return (
          <span className="badge badge-warning float-right">
            {condition}
          </span>
        );
      case "Poor":
        return (
          <span className="badge badge-danger float-right">
            {condition}
          </span>
        );
      default:
        return null;
    }
  };

  if (redirect) {
    return (
      <Navigate
        to={redirect}
        state={{ tradeId }}
      />
    );
  }

  return (
    <ReactModal
      isOpen={show}
      style={style}
      onRequestClose={handleClose}
    >
      <div className="container-fluid">
        <div>
          <h1>
            Confirm Request
            <button
              type="button"
              className="close float-right"
              onClick={handleClose}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h1>
        </div>
        <div className="row">
          <div className="col-6">
            <h3>You</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {tradeData.userTradeList?.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.bg.boardgame.title}{" "}
                        {renderConditionBadge(item.bg.condition)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="col-6">
            <h3>{tradeData.searchedUser}</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {tradeData.searchedUserTradeList?.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.bg.boardgame.title}{" "}
                        {renderConditionBadge(item.bg.condition)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <FormGroup className="col-6">
            <Label htmlFor="notes">Notes</Label>
            <Input
              type="textarea"
              maxLength={500}
              style={{ resize: "none" }}
              rows={5}
              name="notes"
              id="tradeNotes"
              placeholder="500 characters max."
            />
          </FormGroup>
          <div className="offset-5 col-1">
            <button
              className="btn btn-success stickBottom"
              onClick={submitTrade}
            >
              Confirm Trade
              <br />
              <FontAwesomeIcon
                size="lg"
                icon={faExchangeAlt}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default ConfirmRequestModal;
