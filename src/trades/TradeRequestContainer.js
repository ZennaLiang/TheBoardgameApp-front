import React from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import BgListPrice from "./BgListPrice";
import Button from "react-bootstrap/Button";
import ConfirmRequestModal from "./modals/ConfirmRequestModal";
import { getUserId } from "../user/apiUser";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, Input, InputGroupAddon, Alert } from "reactstrap";
import { Link } from "react-router-dom";

class TradeRequestContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToHome: false,
      foundUser: false,
      selectGameAlert: false,
      selectGameMsg: "",
      isLoading: true,
      valueMin: 0,
      valueMax: 9999,
      userBoardgames: [],
      searchedUserBoardgames: [],
      price: 0,
      searchedUserPrice: 0,
      show: false,
      tradeData: {
        userID: "",
        userTradeList: [],
        userTotalPrice: 0,
        searchedUserID: "",
        searchedUser: "",
        searchedUserTotalPrice: 0,
        searchedUserTradeList: [],
        notes: ""
      }
    };
    this.baseTradeData = this.tradeData;
    this.baseState = this.state;
  }

  async loadUserBoardgameData(user) {
    await getUserId(user)
      .then(id => {
        getGuruCollection(id, isAuthenticated().token).then(bgList => {
          let filteredBgList = bgList.filter(bg => bg.forTrade === true);
          this.setState({ userBoardgames: filteredBgList, isLoading: false });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  listsExists = () => {
    console.log(sessionStorage.getItem("myList"));
    if (
      JSON.parse(sessionStorage.getItem("myList")) === null ||
      JSON.parse(sessionStorage.getItem("myList")) === [] ||
      JSON.parse(sessionStorage.getItem("searchedUserList")) === null ||
      JSON.parse(sessionStorage.getItem("searchedUserList")) === []
    ) {
      return false;
    } else {
      return true;
    }
  };

  showModal = e => {
    if (this.listsExists) {
      console.log("tradeData ISNULL");
      this.setState(prevState => ({
        tradeData: {
          ...prevState.tradeData,
          userTradeList: [],
          searchedUserTradeList: []
        }
      }));
    } else {
      this.setState(prevState => ({
        show: !this.state.show,
        tradeData: {
          ...prevState.tradeData,
          userTradeList: JSON.parse(sessionStorage.getItem("myList")),
          searchedUserTradeList: JSON.parse(
            sessionStorage.getItem("searchedUserList")
          )
        }
      }));
    }
    this.setState(prevState => ({
      show: !this.state.show,
      tradeData: {
        ...prevState.tradeData,
        userTradeList: JSON.parse(sessionStorage.getItem("myList")),
        searchedUserTradeList: JSON.parse(
          sessionStorage.getItem("searchedUserList")
        )
      }
    }));
    console.log(this.state.tradeData);
  };

  loadSearchedUserBoardgameData(user) {
    //load logged in user's boardgames
    this.clear();
    this.loadUserBoardgameData(isAuthenticated().user.name);
    this.setState(prevState => ({
      tradeData: { ...prevState.tradeData, userID: isAuthenticated().user._id }
    }));

    getUserId(user)
      .then(id => {
        if (!id || user === isAuthenticated().user.name) {
          document.getElementById("searchbar").classList.add("is-invalid");
        } else {
          getGuruCollection(id, isAuthenticated().token).then(bgList => {
            try {
              let filteredBgList = bgList.filter(bg => bg.forTrade === true);
              this.setState(prevState => ({
                tradeData: {
                  ...prevState.tradeData,
                  searchedUserID: id,
                  searchedUser: user
                },
                searchedUserBoardgames: filteredBgList,
                isLoading: false,
                foundUser: true
              }));
            } catch (e) {
              console.log(e);
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  onChangeSearchBar = () => {
    document.getElementById("searchbar").classList.remove("is-invalid");
  };

  handleSearchButton(event) {
    var inputValue = document.getElementById("searchbar").value;
    this.loadSearchedUserBoardgameData(inputValue);
    sessionStorage.removeItem("myList");
    sessionStorage.removeItem("searchedUserList");
  }
  handleEnterKey(e) {
    let val = e.target.value;
    if (e.key === "Enter" && val.trim().length > 0) {
      var inputValue = document.getElementById("searchbar").value;
      this.loadSearchedUserBoardgameData(inputValue);
    }
  }

  //handles price change up till the decimal, extra validation toFixed(2) is used to round decimals to 2 digits.
  handlePriceChange(event) {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ price: value });
  }
  handleSearchedUserPriceChange(event) {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ searchedUserPrice: value });
  }

  clear = () => {
    this.setState(this.baseState);
    this.setState(prevState => ({
      tradeData: {
        ...prevState.tradeData,
        searchedUserTradeList: [],
        userTradeList: [],
        searchedUserTotalPrice: 0,
        userTotalPrice: 0
      }
    }));
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row my-3 justify-content-center">
          {/* BgSidebar is col-sm-3 */}
          <TradesSideBar />
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="row">
              <div className="col-12 px-0">
                <h4>Make a Trade</h4>
              </div>

              <div className=" col-12 form-inline py-2 px-0">
                <FormGroup className="col-12">
                  <Input
                    id="searchbar"
                    onChange={this.onChangeSearchBar}
                    placeholder="Search..."
                    onKeyUp={e => {
                      this.handleEnterKey(e);
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      variant="primary"
                      className="rounded"
                      onClick={this.handleSearchButton.bind(this)}
                    >
                      <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </Button>
                  </InputGroupAddon>
                  &nbsp;
                  <Input
                    id="clear"
                    type="button"
                    className="btn btn-info rounded block"
                    onClick={this.clear.bind(this)}
                    value="Clear"
                  />
                  <div className="invalid-feedback">
                    User entered is not valid.
                  </div>
                </FormGroup>
              </div>
            </div>
            {/* START Recipient trade list */}
            {!this.state.foundUser ? (
              <div className="row">
                <div className="col-6"></div>
              </div>
            ) : (
              <div>
                <div className="text-info">
                  ***Lists will only show games you have set to wantToTrade in
                  BoardgameGeek***
                </div>
                <div className="row bg-white">
                  {this.state.selectGameAlert ? (
                    <div className="col-12 px-0">
                      <Alert color="warning">{this.state.selectGameMsg}</Alert>
                    </div>
                  ) : null}

                  <div className="col-6">
                    <div className="col-12">
                      <h3>Your List ({this.state.userBoardgames.length})</h3>
                    </div>
                    <br />
                    <div className="col-12 form-group ">
                      <div className="form-group">
                        <BgListPrice
                          bgData={this.state.userBoardgames}
                          listID="myList"
                        />
                      </div>
                    </div>
                  </div>

                  {this.state.searchedUserBoardgames.length > 0 ? (
                    <div className="col-6">
                      <Link to={`/user/${this.state.tradeData.searchedUserID}`}>
                        <h3>
                          {this.state.tradeData.searchedUser
                            .charAt(0)
                            .toUpperCase() +
                            this.state.tradeData.searchedUser.slice(1)}
                          's List ({this.state.searchedUserBoardgames.length})
                        </h3>
                      </Link>

                      <br />
                      <div className="col-12 form-group">
                        <BgListPrice
                          bgData={this.state.searchedUserBoardgames}
                          listID="searchedUserList"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>
                        <Link
                          to={`/user/${this.state.tradeData.searchedUserID}`}
                        >
                          {this.state.tradeData.searchedUser
                            .charAt(0)
                            .toUpperCase() +
                            this.state.tradeData.searchedUser.slice(1)}
                        </Link>{" "}
                        does not have any games for trade.
                      </h3>
                    </div>
                  )}
                </div>

                <div className="row bg-dark p-3">
                  <div className="offset-5">
                    <button
                      id="reviewTradeButton"
                      className="btn btn-success disabled"
                      onClick={e => {
                        this.showModal();
                      }}
                    >
                      Review Trade
                      <br />
                      <FontAwesomeIcon
                        size="lg"
                        icon={faExchangeAlt}
                      ></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <ConfirmRequestModal
                  tradeData={
                    this.state.tradeData !== null ? this.state.tradeData : []
                  }
                  onClose={this.showModal}
                  show={this.state.show}
                ></ConfirmRequestModal>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TradeRequestContainer;
