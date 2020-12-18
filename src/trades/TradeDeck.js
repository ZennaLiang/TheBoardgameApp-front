import React, { useState, useEffect } from "react";
import TradeCard from "./TradeCard";

const TradeDeck = props => {
  const [bgData, setBgData] = useState([{}]);
  const [isLoading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(null);

  const searchSpace = event => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  const items = props.bgData.filter(data => {
    if (searchValue == null) return data;
    else if (
      data.boardgame.title
        .toLowerCase()
        .includes(this.state.search.toLowerCase())
    ) {
      return data;
    }
    return 0;
  });

  items.map(data => {
    return <TradeCard tradeData={data} />;
  });
};

export default TradeDeck;
