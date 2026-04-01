import { isAuthenticated } from "../auth";
import { logger } from "../utils/logger";

export const getBGCollection = (username: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/boardgame/${username}`, {
    method: "GET",
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
    .catch(err => { logger.error("getBGCollection", err); });
};

export const getGuruCollection = (userId: string, token: string) => {
  return fetch(
    `${import.meta.env.VITE_API_URL}/boardgame/user/collection/${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getGuruCollection", err); });
};

export const getBGGCounts = (username: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/boardgame/count/${username}`, {
    method: "GET",
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
    .catch(err => { logger.error("getBGGCounts", err); });
};

export const updateUserBoardgames = (userId: string, boardgameUpdate: unknown) => {
  const token = isAuthenticated() && (isAuthenticated() as any).token;
  return fetch(
    `${import.meta.env.VITE_API_URL}/boardgame/user/collection/${userId}/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(boardgameUpdate)
    }
  )
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .catch(err => { logger.error("updateUserBoardgames", err); });
};

export const getAtlasBoardgameId = (name: string) => {
  return fetch(
    `${import.meta.env.VITE_BOARDGAME_ATLAS_API_URL}/search?name=${name}&fields=id,name,price,msrp&client_id=${import.meta.env.VITE_BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getAtlasBoardgameId", err); });
};

export const getAtlasBoardgamePrice = (game_id: string) => {
  return fetch(
    `${import.meta.env.VITE_BOARDGAME_ATLAS_API_URL}/game/prices?game_id=${game_id}&client_id=${import.meta.env.VITE_BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getAtlasBoardgamePrice", err); });
};
