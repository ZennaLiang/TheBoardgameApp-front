import { isAuthenticated } from "../auth";

export const getBGCollection = (username, token) => {
  return fetch(`${import.meta.env.VITE_API_URL}/boardgame/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
export const getGuruCollection = (userId, token) => {
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
      return response.json();
    })

    .catch(err => console.log(err));
};
export const getBGGCounts = (username, token) => {
  return fetch(`${import.meta.env.VITE_API_URL}/boardgame/count/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const updateUserBoardgames = (userId, boardgameUpdate) => {
  let token = isAuthenticated().token;
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
        return response.json;
      }
    })
    .then(data => {
      return data;
    })
    .catch(err => console.log(err));
};

export const getAtlasBoardgameId = name => {
  console.log(
    `${import.meta.env.VITE_BOARDGAME_ATLAS_API_URL}/search?name=${name}&fields=id,name,price,msrp&client_id=${import.meta.env.VITE_BOARDGAME_ATLAS_CLIENT_ID}`
  );
  return fetch(
    `${import.meta.env.VITE_BOARDGAME_ATLAS_API_URL}/search?name=${name}&fields=id,name,price,msrp&client_id=${import.meta.env.VITE_BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};

export const getAtlasBoardgamePrice = game_id => {
  return fetch(
    `${import.meta.env.VITE_BOARDGAME_ATLAS_API_URL}/game/prices?game_id=${game_id}&client_id=${import.meta.env.VITE_BOARDGAME_ATLAS_CLIENT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};
