import React from "react";
import { isAuthenticated } from "../auth";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import { Input } from "reactstrap";
import TradeCard from "./TradeCard";

class TradeDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgData: [{}],
      isLoading: true,
      search: null
    };
  }

  async loadBoardgameData(user) {
    await getUserId(user)
      .then(id => {
        getGuruCollection(id, isAuthenticated().token).then(bgList => {
          this.state.bgData = bgList;
          console.log(bgList);
          this.setState({ bgData: bgList, isLoading: false });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  UNSAFE_componentWillMount() {
    if (
      isAuthenticated()._id !== this.props.userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      this.setState({ redirectToHome: true });
    }

    let user = "";
    if (this.props.user === "" || this.props.user === undefined) {
      user = isAuthenticated().user.name;
    } else {
      user = this.props.user;
    }
    this.loadBoardgameData(user);
  }

  searchSpace = event => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  render() {
    const items = this.props.bgData.filter(data => {
      if (this.state.search == null) return data;
      else if (
        data.boardgame.title
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
      ) {
        return data;
      }
      return 0;
    });

    return (
      <div id={this.props.listID}>
        <Input
          type="search"
          id="searchList"
          onChange={e => this.searchSpace(e)}
        ></Input>
        {items.map((bg, i) => {
          return <TradeCard id={bg._id} key={bg._id} bg={bg} />;
        })}

        <div className="invalid-feedback">Please select a game to trade.</div>
      </div>
    );
  }
}
export default TradeDeck;
