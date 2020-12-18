import React from "react";
import ReactModal from "react-modal";
import { FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { createTrade } from "../apiTrade";
import { isAuthenticated } from "../../auth";
import { Redirect } from "react-router-dom";

export default class ConfirmRequestModal extends React.Component {
  state = {
    notes: "",
    redirect: null,
    tradeId: null
  };

  componentWillMount() {
    //Required to use modal or else it has errors
    ReactModal.setAppElement("body");
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  submitTrade = () => {
    const token = isAuthenticated().token;
    this.props.tradeData.notes = document.getElementById("tradeNotes").value;
    console.log(this.props.tradeData);
    createTrade(token, this.props.tradeData).then(data => {
      //data returned is only _id of trade
      this.setState({ redirect: "/requestSent", tradeId: data });
    });
  };

  render() {
    const style = {
      content: {
        borderRadius: "4px",
        bottom: "100px",
        left: "15%",
        position: "absolute",
        right: "25%",
        top: "100px",
        width: "80%",
        height: "60%"
      }
    };

    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: this.state.redirect,
            state: { tradeId: this.state.tradeId }
          }}
        />
      );
      // return <RequestSent redirect={this.state.redirect}></RequestSent>
    }
    return (
      <ReactModal
        isOpen={this.props.show}
        style={style}
        onRequestClose={this.onClose}
      >
        <div className="container-fluid">
          <div>
            <h1>
              Confirm Request
              <button
                type="button"
                className="close float-right"
                onClick={this.onClose}
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
                  {this.props.tradeData.userTradeList.map(item => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {item.bg.boardgame.title}{" "}
                          {(function() {
                            switch (item.bg.condition) {
                              case "Excellent":
                                return (
                                  <span className="badge badge-success float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Good":
                                return (
                                  <span className="badge badge-primary float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Fair":
                                return (
                                  <span className="badge badge-warning float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Poor":
                                return (
                                  <span className="badge badge-danger float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              default:
                                return null;
                            }
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="col-6">
              <h3>{this.props.tradeData.searchedUser}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tradeData.searchedUserTradeList.map(item => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {item.bg.boardgame.title}{" "}
                          {(function() {
                            switch (item.bg.condition) {
                              case "Excellent":
                                return (
                                  <span className="badge badge-success float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Good":
                                return (
                                  <span className="badge badge-primary float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Fair":
                                return (
                                  <span className="badge badge-warning float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              case "Poor":
                                return (
                                  <span className="badge badge-danger float-right">
                                    {item.bg.condition}
                                  </span>
                                );
                              default:
                                return null;
                            }
                          })()}
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
              <Label for="notes">Notes</Label>
              <Input
                type="textarea"
                maxLength="500"
                style={{ resize: "none", width: "400" }}
                rows="5"
                name="notes"
                id="tradeNotes"
                placeholder="500 characters max."
              />
            </FormGroup>
            <div className="offset-5 col-1">
              <button
                className="btn btn-success stickBottom"
                onClick={this.submitTrade}
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
  }
}
