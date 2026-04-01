import React, { useState, useRef, useCallback } from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import TradeDeck from "./TradeDeck";
import Button from "react-bootstrap/Button";
import ConfirmRequestModal from "./modals/ConfirmRequestModal";
import { getUserId } from "../user/apiUser";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, Input, InputGroupText, Alert } from "reactstrap";
import { Link } from "react-router-dom";

interface TradeData {
  userID: string;
  userTradeList: any[];
  userTotalPrice: number;
  searchedUserID: string;
  searchedUser: string;
  searchedUserTotalPrice: number;
  searchedUserTradeList: any[];
  notes: string;
}

const TradeRequestContainer: React.FC = () => {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [foundUser, setFoundUser] = useState(false);
  const [selectGameAlert, setSelectGameAlert] = useState(false);
  const [selectGameMsg, setSelectGameMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(9999);
  const [userBoardgames, setUserBoardgames] = useState<any[]>([]);
  const [searchedUserBoardgames, setSearchedUserBoardgames] = useState<any[]>([]);
  const [price, setPrice] = useState(0);
  const [searchedUserPrice, setSearchedUserPrice] = useState(0);
  const [show, setShow] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [tradeData, setTradeData] = useState<TradeData>({
    userID: "",
    userTradeList: [],
    userTotalPrice: 0,
    searchedUserID: "",
    searchedUser: "",
    searchedUserTotalPrice: 0,
    searchedUserTradeList: [],
    notes: ""
  });

  const baseTradeData = useRef({
    userID: "",
    userTradeList: [],
    userTotalPrice: 0,
    searchedUserID: "",
    searchedUser: "",
    searchedUserTotalPrice: 0,
    searchedUserTradeList: [],
    notes: ""
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const baseState = useRef({
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
    show: false
  });

  const loadUserBoardgameData = async (user: string) => {
    try {
      const id = await getUserId(user);
      const bgList = await getGuruCollection(id, isAuthenticated().token);
      const filteredBgList = bgList.filter(bg => bg.forTrade === true);
      setUserBoardgames(filteredBgList);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const parseSessionList = (key: string): unknown[] => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const listsExist = () =>
    sessionStorage.getItem("myList") !== null &&
    sessionStorage.getItem("searchedUserList") !== null;

  const showModal = () => {
    if (!listsExist()) {
      setTradeData(prevState => ({
        ...prevState,
        userTradeList: [],
        searchedUserTradeList: []
      }));
      setShow(s => !s);
      return;
    }
    setShow(s => !s);
    setTradeData(prevState => ({
      ...prevState,
      userTradeList: parseSessionList("myList"),
      searchedUserTradeList: parseSessionList("searchedUserList")
    }));
  };

  const loadSearchedUserBoardgameData = async (user: string) => {
    clear();
    const auth = isAuthenticated();
    if (!auth) return;
    await loadUserBoardgameData(auth.user.name);
    setTradeData(prevState => ({
      ...prevState,
      userID: auth.user._id
    }));

    try {
      const id = await getUserId(user);
      if (!id || user === auth.user.name) {
        searchInputRef.current?.classList.add("is-invalid");
      } else {
        const bgList = await getGuruCollection(id, isAuthenticated().token);
        try {
          const filteredBgList = bgList.filter(bg => bg.forTrade === true);
          setTradeData(prevState => ({
            ...prevState,
            searchedUserID: id,
            searchedUser: user
          }));
          setSearchedUserBoardgames(filteredBgList);
          setIsLoading(false);
          setFoundUser(true);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeSearchBar = () => {
    searchInputRef.current?.classList.remove("is-invalid");
  };

  const handleSearchButton = () => {
    const inputValue = searchInputRef.current?.value ?? "";
    loadSearchedUserBoardgameData(inputValue);
    sessionStorage.removeItem("myList");
    sessionStorage.removeItem("searchedUserList");
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (e.key === "Enter" && val.trim().length > 0) {
      loadSearchedUserBoardgameData(val);
    }
  };

  const handleSelectionChange = useCallback((count: number) => {
    setSelectedCount(count);
  }, []);

  //handles price change up till the decimal, extra validation toFixed(2) is used to round decimals to 2 digits.
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value, min, max } = event.target;
    const numValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setPrice(numValue);
  };

  const handleSearchedUserPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value, min, max } = event.target;
    const numValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setSearchedUserPrice(numValue);
  };

  const clear = () => {
    setRedirectToHome(baseState.current.redirectToHome);
    setFoundUser(baseState.current.foundUser);
    setSelectGameAlert(baseState.current.selectGameAlert);
    setSelectGameMsg(baseState.current.selectGameMsg);
    setIsLoading(baseState.current.isLoading);
    setValueMin(baseState.current.valueMin);
    setValueMax(baseState.current.valueMax);
    setUserBoardgames(baseState.current.userBoardgames);
    setSearchedUserBoardgames(baseState.current.searchedUserBoardgames);
    setPrice(baseState.current.price);
    setSearchedUserPrice(baseState.current.searchedUserPrice);
    setShow(baseState.current.show);
    
    setTradeData(prevState => ({
      ...prevState,
      searchedUserTradeList: [],
      userTradeList: [],
      searchedUserTotalPrice: 0,
      userTotalPrice: 0
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row my-3 justify-content-center">
        {/* BgSidebar is col-sm-3 */}
        <TradesSideBar highlight="Trades" />
        <div className="col-sm-9 col-md-9 col-lg-9">
          <div className="row">
            <div className="col-12 px-0">
              <h4>Make a Trade</h4>
            </div>

            <div className=" col-12 form-inline py-2 px-0">
              <FormGroup className="col-12">
                <Input
                  id="searchbar"
                  innerRef={searchInputRef}
                  onChange={onChangeSearchBar}
                  placeholder="Search..."
                  onKeyUp={handleEnterKey}
                />
                <InputGroupText>
                  <Button
                    variant="primary"
                    className="rounded"
                    onClick={handleSearchButton}
                  >
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                  </Button>
                </InputGroupText>
                &nbsp;
                <Input
                  id="clear"
                  type="button"
                  className="btn btn-info rounded block"
                  onClick={clear}
                  value="Clear"
                />
                <div className="invalid-feedback">
                  User entered is not valid.
                </div>
              </FormGroup>
            </div>
          </div>
          {/* START Recipient trade list */}
          {!foundUser ? (
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
                {selectGameAlert ? (
                  <div className="col-12 px-0">
                    <Alert color="warning">{selectGameMsg}</Alert>
                  </div>
                ) : null}

                <div className="col-6">
                  <div className="col-12">
                    <h3>Your List ({userBoardgames.length})</h3>
                  </div>
                  <br />
                  <div className="col-12 form-group ">
                    <div className="form-group">
                      <TradeDeck
                        bgData={userBoardgames}
                        listID="myList"
                        userId={tradeData.userID}
                        onSelectionChange={handleSelectionChange}
                      />
                    </div>
                  </div>
                </div>

                {searchedUserBoardgames.length > 0 ? (
                  <div className="col-6">
                    <Link to={`/user/${tradeData.searchedUserID}`}>
                      <h3>
                        {tradeData.searchedUser
                          .charAt(0)
                          .toUpperCase() +
                          tradeData.searchedUser.slice(1)}
                        's List ({searchedUserBoardgames.length})
                      </h3>
                    </Link>

                    <br />
                    <div className="col-12 form-group">
                      <TradeDeck
                        bgData={searchedUserBoardgames}
                        listID="searchedUserList"
                        userId={tradeData.searchedUserID}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>
                      <Link
                        to={`/user/${tradeData.searchedUserID}`}
                      >
                        {tradeData.searchedUser
                          .charAt(0)
                          .toUpperCase() +
                          tradeData.searchedUser.slice(1)}
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
                    className={`btn btn-success${selectedCount === 0 ? " disabled" : ""}`}
                    disabled={selectedCount === 0}
                    onClick={showModal}
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
                tradeData={tradeData}
                onClose={showModal}
                show={show}
              ></ConfirmRequestModal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeRequestContainer;
