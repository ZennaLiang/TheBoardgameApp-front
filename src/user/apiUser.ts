import { logger } from "../utils/logger";

export const getUserId = (username: string) => {
  return fetch(
    `${import.meta.env.VITE_API_URL}/user/find/${username.toLowerCase()}`,
    { method: "GET" }
  )
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(responseJson => {
      return responseJson.user._id;
    })
    .catch(err => {
      logger.error("getUserId", err);
      return false;
    });
};

export const getUser = (userId: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
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
    .catch(err => { logger.error("getUser", err); });
};

export const getUsers = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/users`, { method: "GET" })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("getUsers", err); });
};

export const removeUser = (userId: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
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
    .catch(err => { logger.error("removeUser", err); });
};

export const updateUser = (userId: string, token: string, user: FormData) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: user
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("updateUser", err); });
};

export const updateBggBoardgamesByUsername = (userId: string, token: string, bggUsername: string) => {
  return fetch(
    `${import.meta.env.VITE_API_URL}/user/bgg/${bggUsername}&${userId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bggUsername })
    }
  )
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("updateBggBoardgamesByUsername", err); });
};

export const updateLocalStorUser = (userData: { user: unknown }, next: () => void) => {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("jwt");
  if (!raw) return;
  try {
    const auth = JSON.parse(raw);
    auth.user = userData.user;
    localStorage.setItem("jwt", JSON.stringify(auth));
    next();
  } catch {
    logger.error("updateLocalStorUser", "Failed to parse jwt from localStorage");
  }
};

export const followUser = (userId: string, token: string, followId: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/follow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, followId })
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("followUser", err); });
};

export const unfollowUser = (userId: string, token: string, unfollowId: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/unfollow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, unfollowId })
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(err => { logger.error("unfollowUser", err); });
};

export const findPeople = (userId: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/user/findpeople/${userId}`, {
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
    .catch(err => { logger.error("findPeople", err); });
};
