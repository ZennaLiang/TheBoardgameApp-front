import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { getGuruCollection } from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import { Input } from "reactstrap";
import TradeCard from "./TradeCard";

interface TradeDeckProps {
  userId: string;
  user?: string;
  bgData: any[];
  listID: string;
  onSelectionChange?: (count: number) => void;
}

const TradeDeck: React.FC<TradeDeckProps> = ({ userId, user, bgData, listID, onSelectionChange }) => {
  const [bgDataState, setBgDataState] = useState<any[]>([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string | null>(null);
  const [redirectToHome, setRedirectToHome] = useState(false);

  useEffect(() => {
    const loadBoardgameData = async (userName: string) => {
      try {
        const id = await getUserId(userName);
        const bgList = await getGuruCollection(id, isAuthenticated().token);
        setBgDataState(bgList);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    if (
      isAuthenticated().user._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      setRedirectToHome(true);
    }

    let userName = "";
    if (user === "" || user === undefined) {
      userName = isAuthenticated().user.name;
    } else {
      userName = user;
    }
    loadBoardgameData(userName);
  }, [userId, user]);

  const searchSpace = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearch(keyword);
  };

  const items = bgData.filter(data => {
    if (search == null) return data;
    else if (
      data.boardgame.title
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return data;
    }
    return false;
  });

  return (
    <div id={listID}>
      <Input
        type="search"
        id="searchList"
        onChange={searchSpace}
      />
      {items.map((bg) => {
        return <TradeCard id={bg._id} key={bg._id} bg={bg} onSelectionChange={onSelectionChange} />;
      })}

      <div className="invalid-feedback">Please select a game to trade.</div>
    </div>
  );
};
export default TradeDeck;
