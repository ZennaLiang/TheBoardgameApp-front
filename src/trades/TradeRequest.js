import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faClosedCaptioning,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import { getTradeRequestById } from "./apiTrade";
import { UncontrolledCollapse, Button, CardBody, Card } from "reactstrap";
import Helpers from "../helpers";

class TradeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToHome: faClosedCaptioning,
      show: false,
      trade: {},
      isLoading: true
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ id: this.props.id });
    }
  }

  showModal = e => {
    getTradeRequestById(e.currentTarget.id).then(data => {
      console.log(data);
      this.setState({ show: !this.state.show, trade: data });
    });
  };

  badgeBgRender = condition => {
    switch (condition) {
      case "Excellent":
        return "badge-success";
      case "Good":
        return "badge-primary";
      case "Fair":
        return "badge-warning";
      case "Poor":
        return "badge-danger";
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="card">
        <div className="card-header font-weight-bold">
          {this.props.header}

          <Button
            className="additionalActions bg-white "
            data-toggle="dropdown"
          >
            <FontAwesomeIcon icon={faEllipsisH} />
          </Button>

          <div className="dropdown-menu">
            <a className="dropdown-item" href="/">
              Work In Progress
            </a>
          </div>
        </div>

        <div className="card-body">
          {this.props.trades.map(trade => {
            console.log(trade);
            return (
              <div key={trade._id}>
                <Button
                  color="primary"
                  id={"toggle".concat(trade._id)}
                  className="col-12"
                  style={{ marginBottom: "1rem" }}
                >
                  {this.props.header === "Waiting for Response" ? (
                    <div className="float-left pl-3">
                      {trade.tradeReceiver.photo ? (
                        <img
                          className=" float-left rounded-circle avatarSize"
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${trade.tradeReceiver._id}`}
                          alt="avatar"
                        />
                      ) : (
                        <img
                          className=" float-left rounded-circle avatarSize"
                          src="https://picsum.photos/75"
                          alt="avatar"
                        />
                      )}
                      <p className="float-left pl-3 pt-3">
                        <a
                          className="font-weight-bold h5 text-white"
                          href={"user/" + trade.tradeReceiver._id}
                        >
                          {Helpers.capitalize(trade.tradeReceiver.name)}
                        </a>
                        <br />
                        <small className="float-left">
                          {trade.tradeWants.length} games
                        </small>
                      </p>
                    </div>
                  ) : (
                    <div className="float-left pl-3">
                      {trade.tradeSender.photo ? (
                        <img
                          className=" float-left rounded-circle avatarSize"
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${trade.tradeSender._id}`}
                          alt="avatar"
                        />
                      ) : (
                        <img
                          className=" float-left rounded-circle avatarSize"
                          src="https://picsum.photos/75"
                          alt="avatar"
                        />
                      )}
                      <p className="float-left pl-3 pt-3">
                        <a
                          className="font-weight-bold h5 text-white"
                          href={"user/" + trade.tradeSender._id}
                        >
                          {Helpers.capitalize(trade.tradeSender.name)}
                        </a>
                        <br />
                        <small className="float-left">
                          {trade.tradeWants.length} games
                        </small>
                      </p>
                    </div>
                  )}
                  <div className="float-right text-white">
                    {new Date(trade.createdDate).toISOString().slice(0, 10)}
                  </div>
                </Button>
                <UncontrolledCollapse toggler={"#toggle".concat(trade._id)}>
                  <Card>
                    <CardBody>
                      <div className="row">
                        <div className="col">
                          <h4>Wants:</h4>
                          {trade.tradeWants.map(game => (
                            <p key={game._id}>
                              {game.name}{" "}
                              <span
                                className={`badge ${this.badgeBgRender(
                                  game.condition
                                )} float-right mt-1`}
                              >
                                {game.condition === "N/A"
                                  ? null
                                  : game.condition}
                              </span>
                            </p>
                          ))}
                        </div>
                        <div className="col">
                          <h4>Offer:</h4>
                          {trade.tradeOffer.map(game => (
                            <p key={game._id}>
                              {game.name}{" "}
                              <span
                                className={`badge ${this.badgeBgRender(
                                  game.condition
                                )} float-right mt-1`}
                              >
                                {game.condition === "N/A"
                                  ? null
                                  : game.condition}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col">
                          <h4>Notes:</h4>
                          <p>{trade.notes}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => this.props.onClickDelete(trade._id)}
                        className="btn btn-danger float-right"
                      >
                        <FontAwesomeIcon icon={faTimes} />{" "}
                        {this.props.deleteText}
                      </button>

                      {this.props.successButton === "Accept" ? (
                        <button
                          type="button"
                          onClick={() => this.props.onClickAccept(trade._id)}
                          className="btn btn-success float-right mr-2"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          {this.props.successButton}
                        </button>
                      ) : null}
                    </CardBody>
                  </Card>
                </UncontrolledCollapse>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default TradeRequest;
