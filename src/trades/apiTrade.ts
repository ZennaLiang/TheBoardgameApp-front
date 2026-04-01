import { logger } from "../utils/logger";

function replacer(key: string, value: unknown) {
  if (key === "userTradeList" || key === "searchedUserTradeList") {
    const list: unknown[] = [];
    const arr = value as any[];
    for (let i = 0; i < arr.length; i++) {
      list.push({
        name: arr[i].bg.boardgame.title,
        condition: arr[i].bg.condition,
        id: arr[i].id,
        tags: arr[i].bg.tags
      });
    }
    return list;
  }
  return value;
}

export const createTrade = (token: string, trade: unknown) => {
  return fetch(`${import.meta.env.VITE_API_URL}/trade/requestTrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(trade, replacer)
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => data.tradeId)
    .catch(err => { logger.error("createTrade", err); });
};

export const deleteTrade = (token: string, tradeId: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/trade/delete/${tradeId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("deleteTrade", err); });
};

export const getAllTradeRequests = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/trades`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getAllTradeRequests", err); });
};

export const getAllTradeRequestsById = (userId: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/trades/by/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.status === 204) return false;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getAllTradeRequestsById", err); });
};

export const getTradeRequestById = (tradeId: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/trade/by/${tradeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getTradeRequestById", err); });
};

export const updateTradeStatus = (token: string, tradeId: string, status: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/trade/update/${tradeId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("updateTradeStatus", err); });
};
